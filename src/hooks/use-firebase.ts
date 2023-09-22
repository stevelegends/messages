// react
import { useCallback } from "react";

// modules

// utils
import { ErrorHandler, generateUUIDV4, setItemAsyncSecureStore } from "@utils";

// services
import { getFirebaseAuth } from "@services/firebase-app";

// firebase
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from "firebase/auth";
import { getDatabase, set, get, ref, child, update } from "firebase/database";
import {
    getStorage,
    ref as storageRef,
    uploadBytesResumable,
    getDownloadURL
} from "firebase/storage";

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
                ErrorHandler(error);
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
                ErrorHandler(error);
            }
            onLoading(false);
        },
        []
    );

    const createUser = useCallback(async ({ firstName, lastName, email, userId }: CreateUser) => {
        try {
            const firstLast = `${firstName} ${lastName}`.toLowerCase();
            const userData = {
                firstName,
                lastName,
                firstLast,
                email,
                userId,
                signUpDate: new Date().toISOString()
            };

            const dbRef = ref(getDatabase());
            const childRef = child(dbRef, `users/${userId}`);
            await set(childRef, userData);
            return userData;
        } catch (error) {
            ErrorHandler(error);
        }
    }, []);

    const getUserData = useCallback(async (payload: { userId: string }): Promise<any> => {
        try {
            const dbRef = ref(getDatabase());
            const userRef = child(dbRef, `users/${payload.userId}`);
            const snapshot = await get(userRef);
            return snapshot.val();
        } catch (error) {
            ErrorHandler(error);
        }
    }, []);

    const onUpdateSignedInUserData = useCallback(
        async (
            payload: { userId: string; newData: any },
            onLoading: (isLoading: boolean) => void,
            onAuthResult: (payload: { userData: any }) => void
        ) => {
            onLoading(true);
            try {
                const dbRef = ref(getDatabase());
                const userRef = child(dbRef, `users/${payload.userId}`);
                const firstLast =
                    `${payload.newData.firstName} ${payload.newData.lastName}`.toLowerCase();
                const userData = {
                    firstLast,
                    firstName: payload.newData.firstName,
                    lastName: payload.newData.lastName,
                    about: payload.newData.about,
                    updateDate: new Date().toISOString()
                };
                await update(userRef, userData);
                onAuthResult({ userData });
            } catch (e: any) {
                ErrorHandler(e);
            }
            onLoading(false);
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
                    reject({ code: "network_failed" });
                };
                xhr.responseType = "blob";
                xhr.open("GET", uri, true);
                xhr.send();
            });
        } catch (e) {
            onLoading(false);
            ErrorHandler(e);
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
            ErrorHandler(e);
            return;
        }

        try {
            const resultUrl = await getDownloadURL(sRef);
            if (resultUrl) {
                onResult({ url: resultUrl });
            } else {
                throw { code: "upload_image_fail" };
            }
        } catch (e) {
            onLoading(false);
            ErrorHandler(e);
            return;
        }

        onLoading(false);
    };

    return {
        onSignUp,
        onSignIn,
        getUserData,
        onUpdateSignedInUserData,
        onUploadImageAsync
    };
};

export default useFirebase;
