// react
import { useCallback } from "react";

// modules
import { Alert } from "react-native";
import { i18n } from "@lingui/core";
import { msg } from "@lingui/macro";

// utils
import { ErrorMessage, getData } from "@utils";

// hooks
import { useFirebase } from "@hooks/index";

// store
import useAuth from "@store/features/auth/use-auth";

const useLogin = () => {
    const auth = useAuth();
    const firebase = useFirebase();

    const onCheckLogin = useCallback(async (): Promise<boolean> => {
        const userData = await getData("userData");

        if (userData) {
            try {
                const user = JSON.parse(userData);
                const token = user.token;
                const userId = user.userId;
                const expiryDate = user.expiryDate ? new Date(user.expiryDate) : new Date();
                if (expiryDate <= new Date() || !token || !userId) {
                    auth.onLogout();
                    Alert.alert(i18n._(msg`Session Expired`), i18n._(msg`Please sign in again.`), [
                        { text: i18n._(msg`Ok`) }
                    ]);
                } else {
                    const data = await firebase.getUserData({ userId });
                    auth.setAuthenticate({ token, userData: data });
                }
            } catch (e: any) {
                const message = e.code
                    ? i18n._(ErrorMessage[e.code as keyof typeof ErrorMessage])
                    : e.message;
                Alert.alert(i18n._(msg`An error occurred`), message, [{ text: i18n._(msg`Ok`) }]);
            }
        }

        return true;
    }, []);

    return { onCheckLogin };
};

export default useLogin;
