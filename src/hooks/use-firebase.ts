// modules
import { createUserWithEmailAndPassword } from "firebase/auth";
import { i18n } from "@lingui/core";

// utils
import { ErrorMessage } from "@utils";

// services
import { getFirebaseAuth } from "@services/firebase-app";

type AuthSignUp = {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
};

const useFirebase = () => {
    const auth = getFirebaseAuth();

    const onSignUp = async (payload: AuthSignUp) => {
        try {
            const result = await createUserWithEmailAndPassword(
                auth,
                payload.email,
                payload.password
            );
            __DEV__ && console.log("SignUp result", result);
        } catch (e: any) {
            alert(e.code ? i18n._(ErrorMessage[e.code as keyof typeof ErrorMessage]) : e.message);
        }
    };

    return {
        onSignUp
    };
};

export default useFirebase;
