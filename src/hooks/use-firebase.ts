// react
import { useCallback } from "react";

// modules
// utils
import {
    compressImageEachSize,
    DeviceInfo,
    encrypted,
    ErrorHandler,
    generateHashedUUID,
    generateUUID,
    getImageSizeToKBAsync,
    getItemAsyncSecureStore,
    setItemAsyncSecureStore
} from "@utils";
import { ErrorHandlerPayload } from "../utils/error-handler";

// services
import { getFirebaseAuth } from "@services/firebase-app";

// firebase
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from "firebase/auth";
import {
    child,
    get,
    getDatabase,
    ref,
    set,
    update,
    query,
    orderByChild,
    startAt,
    endAt,
    push,
    onValue,
    off,
    remove,
    DataSnapshot,
    DatabaseReference
} from "firebase/database";
import {
    getDownloadURL,
    getStorage,
    ref as storageRef,
    uploadBytesResumable
} from "firebase/storage";

// constants
import { DefaultUser, UserStatus } from "@constants/user-status";
import { getUserRole } from "@constants/user-roles";

type AuthSignUp = {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
};

type AuthSignIp = {
    email: string;
    password: string;
};

type CreateUser = {
    firstName: string;
    lastName: string;
    email: string;
    userId: string;
};

const useFirebase = () => {
    const onSignUp = useCallback(async (payload, onLoading, onAuthResult, onError) => {
        onLoading(true);
        try {
            const result = await createUserWithEmailAndPassword(
                getFirebaseAuth(),
                payload.email,
                payload.password
            );
            const user: any = result.user;
            const {
                uid,
                stsTokenManager: { accessToken, expirationTime }
            } = user;
            const expiryDate = new Date(expirationTime);
            // const timeNow = new Date();
            // const millisecondsUntilExpiry = expiryDate - timeNow;

            // should call logout in time
            // timer = setTimeout(() => {
            // },  millisecondsUntilExpiry)

            const userData = await createUser({
                firstName: payload.firstName,
                lastName: payload.lastName,
                email: payload.email,
                userId: uid
            });

            setItemAsyncSecureStore(
                "userData",
                JSON.stringify({
                    token: accessToken,
                    userId: uid,
                    expiryDate: expiryDate.toISOString()
                })
            );

            onAuthResult({ token: accessToken, userData });
        } catch (error) {
            onError(ErrorHandler(error, "onSignUp"));
        }
        onLoading(false);
    }, []) as (
        payload: AuthSignUp,
        onLoading: (isLoading: boolean) => void,
        onAuthResult: (payload: { token: string; userData: any }) => void,
        onError: (error: ErrorHandlerPayload) => void
    ) => Promise<void>;

    const onSignIn = useCallback(async (payload, onLoading, onAuthResult, onError) => {
        onLoading(true);
        try {
            const result = await signInWithEmailAndPassword(
                getFirebaseAuth(),
                payload.email,
                payload.password
            );
            const user: any = result.user;
            const {
                uid,
                stsTokenManager: { accessToken, expirationTime }
            } = user;
            const expiryDate = new Date(expirationTime);

            // const timeNow = new Date();
            // const millisecondsUntilExpiry = expiryDate - timeNow;

            // should call logout in time
            // timer = setTimeout(() => {
            // },  millisecondsUntilExpiry)

            let userData = await getUserDataAsync({ userId: uid });
            if (!userData) {
                userData = await createUser({
                    firstName: DefaultUser.firstNameMD5,
                    lastName: DefaultUser.lastNameMD5,
                    email: payload.email,
                    userId: uid
                });
            }
            if (!userData) {
                throw { code: "account-synced-failed" };
            }
            // if (userData && userData.status === UserStatus.active) {
            //     throw { code: "account-logged-in-already" };
            // }

            setItemAsyncSecureStore(
                "userData",
                JSON.stringify({
                    token: accessToken,
                    userId: uid,
                    expiryDate: expiryDate.toISOString()
                })
            );

            onAuthResult({ token: accessToken, userData: userData || {} });
        } catch (error) {
            onError(ErrorHandler(error, "onSignIn"));
        }
        onLoading(false);
    }, []) as (
        payload: AuthSignIp,
        onLoading: (isLoading: boolean) => void,
        onAuthResult: (payload: { token: string; userData: any }) => void,
        onError: (error: ErrorHandlerPayload) => void
    ) => Promise<void>;

    const createUser = useCallback(async ({ firstName, lastName, email, userId }) => {
        try {
            const firstLast = `${firstName} ${lastName}`.toLowerCase();
            const hashed = await generateHashedUUID(userId);
            const role = getUserRole;
            const userData = {
                firstName,
                lastName,
                firstLast,
                email: encrypted(email, hashed),
                userId,
                role,
                hashed,
                signUpDate: new Date().toISOString()
            };

            const dbRef = ref(getDatabase());
            const childRef = child(dbRef, `users/${userId}`);
            await set(childRef, userData);
            return userData;
        } catch (error) {
            ErrorHandler(error, "createUser");
        }
    }, []) as ({ firstName, lastName, email, userId }: CreateUser) => Promise<any>;

    const getUserDataAsync = useCallback(async payload => {
        try {
            const dbRef = ref(getDatabase());
            const userRef = child(dbRef, `users/${payload.userId}`);
            const snapshot = await get(userRef);
            return snapshot.val();
        } catch (error) {
            ErrorHandler(error, "getUserDataAsync");
        }
    }, []) as (payload: { userId: string }) => Promise<any>;

    const getUserDataByText = useCallback(async payload => {
        try {
            const searchTerm = payload.queryText.toLowerCase();

            const dbRef = ref(getDatabase());
            const userRef = child(dbRef, `users`);
            const queryRef = query(
                userRef,
                orderByChild("firstLast"),
                startAt(searchTerm),
                endAt(searchTerm + "\uf8ff")
            );
            const snapshot = await get(queryRef);
            if (snapshot.exists()) {
                return snapshot.val();
            }
        } catch (error) {
            ErrorHandler(error, "getUserDataByText");
        }
        return {};
    }, []) as (payload: { queryText: string }) => Promise<string>;

    const onUpdateSignedInUserData = useCallback(async (payload, onLoading, onAuthResult) => {
        onLoading(true);
        try {
            const dbRef = ref(getDatabase());
            const userRef = child(dbRef, `users/${payload.userId}`);
            const firstLast = `${payload.firstName} ${payload.lastName}`.toLowerCase();
            const firstName = payload.firstName;
            const lastName = payload.lastName;
            const about = payload.about;
            const updateDate = new Date().toISOString();
            await update(userRef, {
                firstLast,
                firstName,
                lastName,
                about,
                updateDate
            });
            onAuthResult({
                firstLast,
                firstName,
                lastName,
                about,
                updateDate
            });
        } catch (e: any) {
            ErrorHandler(e, "onUpdateSignedInUserData");
        }
        onLoading(false);
    }, []) as (
        payload: { userId: string; firstName: string; lastName: string; about: string },
        onLoading: (isLoading: boolean) => void,
        onAuthResult: (payload: {
            firstLast: string;
            firstName: string;
            lastName: string;
            about: string;
            updateDate: string;
        }) => void
    ) => Promise<void>;

    const onUpdateSignedInUserAvatarData = useCallback(async (payload, onLoading, onAuthResult) => {
        onLoading && onLoading(true);
        try {
            const dbRef = ref(getDatabase());
            const userRef = child(dbRef, `users/${payload.userId}`);

            const profilePicture = payload.url;
            const updateDate = new Date().toISOString();

            await update(userRef, {
                profilePicture,
                updateDate
            });

            onAuthResult && onAuthResult({ profilePicture, updateDate });
        } catch (e: any) {
            ErrorHandler(e, "onUpdateSignedInUserAvatarData");
        }
        onLoading && onLoading(false);
    }, []) as (
        payload: { userId: string; url: string },
        onLoading?: (isLoading: boolean) => void,
        onAuthResult?: (payload: { profilePicture: string; updateDate: string }) => void
    ) => Promise<void>;

    const onUpdateSignedInUserStatusData = useCallback(async (payload, onUserDataResult) => {
        try {
            let unitKey;
            unitKey = await getItemAsyncSecureStore("unitKey");
            if (!unitKey) {
                unitKey = generateUUID();
                await setItemAsyncSecureStore("unitKey", unitKey);
            }

            const dbRef = ref(getDatabase());
            const userRef = child(dbRef, `users/${payload.userId}`);

            const status = payload.status;
            const device = JSON.stringify(DeviceInfo);
            const lastOnlineDate = new Date().toISOString();
            const session = {
                ...payload.session,
                [unitKey]: {
                    status,
                    device,
                    lastOnlineDate
                }
            };
            await update(userRef, { session });
            onUserDataResult && onUserDataResult({ session });
        } catch (e: any) {
            console.log("onUpdateSignedInUserStatusData: ", e);
        }
    }, []) as (
        payload: { userId: string; status: UserStatus; session: any },
        onUserDataResult?: (payload: { session: any }) => void
    ) => Promise<void>;

    const onUploadImageAsync = useCallback(async (uri, onLoading, onResult, path, imageSize) => {
        onLoading(true);

        const compressedUri = await compressImageEachSize(uri, 100, imageSize);

        if (__DEV__) {
            const size = await getImageSizeToKBAsync(compressedUri);
            console.log("getImageSizeToKBAsync", size, " KB");
        }

        let blob: any;
        let sRef: any;
        try {
            blob = await new Promise((resolve, reject) => {
                const xhr = new XMLHttpRequest();
                xhr.onload = function () {
                    resolve(xhr.response);
                };
                xhr.onerror = function (e) {
                    reject({ code: "network-failed" });
                };
                xhr.responseType = "blob";
                xhr.open("GET", compressedUri, true);
                xhr.send();
            });
        } catch (e) {
            onLoading(false);
            ErrorHandler(e, "onUploadImageAsync - blob");
            return;
        }

        try {
            const uuid = generateUUID();
            sRef = storageRef(getStorage(), `${path}/${uuid}`);
            await uploadBytesResumable(sRef, blob);

            blob.close();
        } catch (e) {
            onLoading(false);
            ErrorHandler(e, "onUploadImageAsync - uploadBytesResumable");
            return;
        }

        try {
            const resultUrl = await getDownloadURL(sRef);
            if (resultUrl) {
                onResult({ url: resultUrl });
            } else {
                throw { code: "upload-image-failed" };
            }
        } catch (e) {
            onLoading(false);
            ErrorHandler(e, "onUploadImageAsync - getDownloadURL");
            return;
        }

        onLoading(false);
    }, []) as (
        uri: string,
        onLoading: (isLoading: boolean) => void,
        onResult: (payload: { url: string }) => void,
        path: "profilePics" | "chatImages",
        imageSize?: number
    ) => Promise<void>;

    const onCreateChatAsync = useCallback(async (loggedInUserId, chatData) => {
        try {
            const newChatData = {
                ...chatData,
                createdBy: loggedInUserId,
                updatedBy: loggedInUserId,
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString()
            };
            const dbRef = ref(getDatabase());
            const newChat = await push(child(dbRef, "chats"), newChatData);

            const chatUsers = chatData?.users || [];
            for (let i = 0; i < chatUsers.length; i++) {
                const userId = chatUsers[i];
                await push(child(dbRef, `userChats/${userId}`), newChat.key);
            }

            return newChat.key || "";
        } catch (e) {
            ErrorHandler(e, "onCreateChatAsync");
        }
        return "";
    }, []) as (loggedInUserId: string, chatData: any) => Promise<string>;

    const onUserChatsListener = useCallback((userId, listener) => {
        const dbRef = ref(getDatabase());
        const userChatsRef = child(dbRef, `userChats/${userId}`);

        onValue(
            userChatsRef,
            dataSnapshot => {
                const chatIdsData = dataSnapshot.val() || {};
                const chatIds = Object.values(chatIdsData);
                listener(chatIds);
            },
            error => {
                ErrorHandler(error, "onUserChatsListener");
            }
        );

        return userChatsRef;
    }, []) as (userId: string, listener: (chatIds: unknown[]) => void) => void;

    const onChatsListener = useCallback((chatId, listener) => {
        if (!chatId) return;
        const dbRef = ref(getDatabase());
        const chatRef = child(dbRef, `chats/${chatId}`);

        onValue(
            chatRef,
            dataSnapshot => {
                listener(dataSnapshot);
            },
            error => {
                ErrorHandler(error, "onUserChatsListener");
            }
        );

        return chatRef;
    }, []) as (chatId: string, listener: (dataSnapshot: DataSnapshot) => void) => void;

    const onUnSubscribeFromListener = useCallback(ref => {
        if (ref) {
            off(ref);
        }
    }, []) as (ref: any) => void;

    const onSendMessageTextAsync = useCallback(
        async ({ chatId, senderId, messageText, replyTo, imageUrls }) => {
            const dbRef = ref(getDatabase());
            const messagesRef = child(dbRef, `messages/${chatId}`);

            const messageData = {
                sentBy: senderId,
                sentAt: new Date().toISOString(),
                text: messageText
            };
            if (replyTo) {
                (messageData as typeof messageData & { replyTo: string }).replyTo = replyTo;
            }
            if (imageUrls) {
                (messageData as typeof messageData & { imageUrls: Array<string> }).imageUrls =
                    imageUrls;
            }

            try {
                await push(messagesRef, messageData);

                const chatRef = child(dbRef, `chats/${chatId}`);
                await update(chatRef, {
                    updatedBy: senderId,
                    updatedAt: new Date().toISOString(),
                    latestMessageText: messageText
                });
            } catch (error) {
                ErrorHandler(error, "onSendMessageTextAsync");
            }
        },
        []
    ) as (payload: {
        chatId: string;
        senderId: string;
        messageText: string;
        replyTo?: string;
        imageUrls?: Array<string>;
    }) => Promise<void>;

    const onMessagesListener = useCallback((chatId, listener) => {
        const dbRef = ref(getDatabase());
        const messagesRef = child(dbRef, `messages/${chatId}`);

        onValue(
            messagesRef,
            dataSnapshot => {
                listener(dataSnapshot);
            },
            error => {
                ErrorHandler(error, "onUserChatsListener");
            }
        );

        return messagesRef;
    }, []) as (chatId: string, listener: (dataSnapshot: DataSnapshot) => void) => void;

    const onStarMessageAsync = useCallback(async (userId, chatId, messageId) => {
        try {
            const dbRef = ref(getDatabase());
            const childRef = child(dbRef, `userStarredMessages/${userId}/${chatId}/${messageId}`);
            const snapshot = await get(childRef);

            if (snapshot.exists()) {
                // starred item exists - Un-star
                await remove(childRef);
            } else {
                // starred item does not exists - star
                const starredMessageData = {
                    messageId,
                    chatId,
                    starredAt: new Date().toISOString()
                };
                await set(childRef, starredMessageData);
            }
        } catch (error) {
            ErrorHandler(error, "onStarMessageAsync");
        }
    }, []) as (userId: string, chatId: string, messageId: string) => Promise<void>;

    const onUserStarredMessagesListener = useCallback((userId, listener) => {
        const dbRef = ref(getDatabase());
        const userStarredMessagesRef = child(dbRef, `userStarredMessages/${userId}`);

        onValue(
            userStarredMessagesRef,
            dataSnapshot => {
                listener(dataSnapshot);
            },
            error => {
                ErrorHandler(error, "onUserChatsListener");
            }
        );

        return userStarredMessagesRef;
    }, []) as (userId: string, listener: (dataSnapshot: DataSnapshot) => void) => DatabaseReference;

    return {
        onSignUp,
        onSignIn,
        getUserDataAsync,
        onUpdateSignedInUserData,
        onUploadImageAsync,
        onUpdateSignedInUserAvatarData,
        onUpdateSignedInUserStatusData,
        getUserDataByText,
        onCreateChatAsync,
        onUserChatsListener,
        onUnSubscribeFromListener,
        onChatsListener,
        onSendMessageTextAsync,
        onMessagesListener,
        onStarMessageAsync,
        onUserStarredMessagesListener
    };
};

export default useFirebase;
