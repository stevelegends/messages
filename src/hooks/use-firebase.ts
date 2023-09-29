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
    DataSnapshot
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
    const onSignUp = useCallback(
        async (
            payload: AuthSignUp,
            onLoading: (isLoading: boolean) => void,
            onAuthResult: (payload: { token: string; userData: any }) => void,
            onError: (error: ErrorHandlerPayload) => void
        ) => {
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
        },
        []
    );

    const onSignIn = useCallback(
        async (
            payload: AuthSignIp,
            onLoading: (isLoading: boolean) => void,
            onAuthResult: (payload: { token: string; userData: any }) => void,
            onError: (error: ErrorHandlerPayload) => void
        ) => {
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
        },
        []
    );

    const createUser = useCallback(async ({ firstName, lastName, email, userId }: CreateUser) => {
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
    }, []);

    const getUserDataAsync = useCallback(async (payload: { userId: string }): Promise<any> => {
        try {
            const dbRef = ref(getDatabase());
            const userRef = child(dbRef, `users/${payload.userId}`);
            const snapshot = await get(userRef);
            return snapshot.val();
        } catch (error) {
            ErrorHandler(error, "getUserDataAsync");
        }
    }, []);

    const getUserDataByText = useCallback(async (payload: { queryText: string }): Promise<any> => {
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
    }, []);

    const onUpdateSignedInUserData = useCallback(
        async (
            payload: { userId: string; firstName: string; lastName: string; about: string },
            onLoading: (isLoading: boolean) => void,
            onAuthResult: (payload: {
                firstLast: string;
                firstName: string;
                lastName: string;
                about: string;
                updateDate: string;
            }) => void
        ) => {
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
        },
        []
    );

    const onUpdateSignedInUserAvatarData = useCallback(
        async (
            payload: { userId: string; url: string },
            onLoading?: (isLoading: boolean) => void,
            onAuthResult?: (payload: { profilePicture: string; updateDate: string }) => void
        ) => {
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
        },
        []
    );

    const onUpdateSignedInUserStatusData = useCallback(
        async (
            payload: { userId: string; status: UserStatus; session: any },
            onUserDataResult?: (payload: { session: any }) => void
        ) => {
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
        },
        []
    );

    const onUploadImageAsync = async (
        uri: string,
        onLoading: (isLoading: boolean) => void,
        onResult: (payload: { url: string }) => void,
        imageSize?: number
    ) => {
        onLoading(true);

        const compressedUri = await compressImageEachSize(uri, 100, imageSize);

        if (__DEV__) {
            const size = await getImageSizeToKBAsync(compressedUri);
            console.log("getImageSizeToKBAsync", size);
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
            const path = "profilePics";
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
    };

    const onCreateChatAsync = async (loggedInUserId: string, chatData: any): Promise<string> => {
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
    };

    const onUserChatsListener = (userId: string, listener: (chatIds: unknown[]) => void) => {
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
    };

    const onChatsListener = (chatId: string, listener: (dataSnapshot: DataSnapshot) => void) => {
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
    };

    const onUnSubscribeFromListener = (ref: any) => {
        if (ref) {
            off(ref);
        }
    };

    const onSendMessageTextAsync = async (
        chatId: string,
        senderId: string,
        messageText: string
    ) => {
        const dbRef = ref(getDatabase());
        const messagesRef = child(dbRef, `messages/${chatId}`);

        const messageData = {
            sentBy: senderId,
            sentAt: new Date().toISOString(),
            text: messageText
        };

        try {
            await push(messagesRef, messageData);
        } catch (error) {
            ErrorHandler(error, "onSendMessageTextAsync");
        }
    };

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
        onSendMessageTextAsync
    };
};

export default useFirebase;
