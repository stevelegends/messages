// react
import { useCallback } from "react";

// modules
import { i18n } from "@lingui/core";
import { Alert } from "react-native";
import { msg } from "@lingui/macro";

// utils
import { ErrorMessage, setItemAsyncSecureStore } from "@utils";

// services
import { getFirebaseAuth } from "@services/firebase-app";

// firebase
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from "firebase/auth";
import { getDatabase, set, get, ref, child, update } from "firebase/database";

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
            } catch (e: any) {
                const message = ErrorMessage[e.code as keyof typeof ErrorMessage]
                    ? i18n._(ErrorMessage[e.code as keyof typeof ErrorMessage])
                    : e.message;
                Alert.alert(i18n._(msg`An error occurred`), message, [{ text: i18n._(msg`Ok`) }]);
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
            } catch (e: any) {
                const message = ErrorMessage[e.code as keyof typeof ErrorMessage]
                    ? i18n._(ErrorMessage[e.code as keyof typeof ErrorMessage])
                    : e.message;
                Alert.alert(i18n._(msg`An error occurred`), message, [{ text: i18n._(msg`Ok`) }]);
            }
            onLoading(false);
        },
        []
    );

    const createUser = useCallback(async ({ firstName, lastName, email, userId }: CreateUser) => {
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
    }, []);

    const getUserData = useCallback(async (payload: { userId: string }): Promise<any> => {
        try {
            const dbRef = ref(getDatabase());
            const userRef = child(dbRef, `users/${payload.userId}`);
            const snapshot = await get(userRef);
            return snapshot.val();
        } catch (error) {
            __DEV__ && console.log("getUserData", error);
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
                const message = ErrorMessage[e.code as keyof typeof ErrorMessage]
                    ? i18n._(ErrorMessage[e.code as keyof typeof ErrorMessage])
                    : e.message;
                Alert.alert(i18n._(msg`An error occurred`), message, [{ text: i18n._(msg`Ok`) }]);
            }
            onLoading(false);
        },
        []
    );

    return {
        onSignUp,
        onSignIn,
        getUserData,
        onUpdateSignedInUserData
    };
};

export default useFirebase;
