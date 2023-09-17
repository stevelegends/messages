// modules
import { i18n } from "@lingui/core";
import { Alert } from "react-native";
import { msg } from "@lingui/macro";

// utils
import { ErrorMessage } from "@utils";

// services
import { getFirebaseAuth } from "@services/firebase-app";

// firebase
import { createUserWithEmailAndPassword } from "firebase/auth";
import { getDatabase, set, ref, child } from "firebase/database";

type AuthSignUp = {
    firstName: string;
    lastName: string;
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
    const firebaseAuth = getFirebaseAuth();

    const onSignUp = async (
        payload: AuthSignUp,
        onLoading: (isLoading: boolean) => void,
        onAuthResult: (payload: { token: string; userData: any }) => void
    ) => {
        onLoading(true);
        try {
            const result = await createUserWithEmailAndPassword(
                firebaseAuth,
                payload.email,
                payload.password
            );
            const user: any = result.user;
            const {
                uid,
                stsTokenManager: { accessToken }
            } = user;
            const userData = await createUser({
                firstName: payload.firstName,
                lastName: payload.lastName,
                email: payload.email,
                userId: uid
            });
            onAuthResult({ token: accessToken, userData });
        } catch (e: any) {
            const message = e.code
                ? i18n._(ErrorMessage[e.code as keyof typeof ErrorMessage])
                : e.message;
            Alert.alert(i18n._(msg`An error occurred`), message, [{ text: i18n._(msg`Ok`) }]);
        }
        onLoading(false);
    };

    const createUser = async ({ firstName, lastName, email, userId }: CreateUser) => {
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
    };

    return {
        onSignUp
    };
};

export default useFirebase;
