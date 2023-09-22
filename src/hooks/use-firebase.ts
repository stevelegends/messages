// react
import { useCallback } from "react";

// modules
// utils
import { ErrorHandler, generateUUIDV4, setItemAsyncSecureStore } from "@utils";

// services
import { getFirebaseAuth } from "@services/firebase-app";

// firebase
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from "firebase/auth";
import { child, get, getDatabase, ref, set, update } from "firebase/database";
import {
    getDownloadURL,
    getStorage,
    ref as storageRef,
    uploadBytesResumable
} from "firebase/storage";

// constants
import { UserStatus } from "@constants/user-status";
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
            onAuthResult: (payload: { token: string; userData: any }) => void
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
                ErrorHandler(error, "onSignUp");
            }
            onLoading(false);
        },
        []
    );

    const onSignIn = useCallback(
        async (
            payload: AuthSignIp,
            onLoading: (isLoading: boolean) => void,
            onAuthResult: (payload: { token: string; userData: any }) => void
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

                const userData = await getUserData({ userId: uid });

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
                ErrorHandler(error, "onSignIn");
            }
            onLoading(false);
        },
        []
    );

    const createUser = useCallback(async ({ firstName, lastName, email, userId }: CreateUser) => {
        try {
            const firstLast = `${firstName} ${lastName}`.toLowerCase();
            const role = getUserRole;
            const userData = {
                firstName,
                lastName,
                firstLast,
                email,
                userId,
                role,
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

    const getUserData = useCallback(async (payload: { userId: string }): Promise<any> => {
        try {
            const dbRef = ref(getDatabase());
            const userRef = child(dbRef, `users/${payload.userId}`);
            const snapshot = await get(userRef);
            return snapshot.val();
        } catch (error) {
            ErrorHandler(error, "getUserData");
        }
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
            payload: { userId: string; status: UserStatus },
            onUserDataResult: (payload: { status: UserStatus; lastOnlineDate: string }) => void
        ) => {
            try {
                const dbRef = ref(getDatabase());
                const userRef = child(dbRef, `users/${payload.userId}`);

                const status = payload.status;
                const lastOnlineDate = new Date().toISOString();

                await update(userRef, { status, lastOnlineDate });
                onUserDataResult({ status, lastOnlineDate });
            } catch (e: any) {
                console.log("onUpdateSignedInUserStatusData: ", e);
            }
        },
        []
    );

    const onUploadImageAsync = async (
        uri: string,
        onLoading: (isLoading: boolean) => void,
        onResult: (payload: { url: string }) => void
    ) => {
        onLoading(true);
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
                xhr.open("GET", uri, true);
                xhr.send();
            });
        } catch (e) {
            onLoading(false);
            ErrorHandler(e, "onUploadImageAsync - blob");
            return;
        }

        try {
            const path = "profilePics";
            const uuidV4 = generateUUIDV4();
            sRef = storageRef(getStorage(), `${path}/${uuidV4}`);
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

    return {
        onSignUp,
        onSignIn,
        getUserData,
        onUpdateSignedInUserData,
        onUploadImageAsync,
        onUpdateSignedInUserAvatarData,
        onUpdateSignedInUserStatusData
    };
};

export default useFirebase;
