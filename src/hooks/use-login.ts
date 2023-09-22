// react
import { useCallback } from "react";

// utils
import { ErrorHandler, getItemAsyncSecureStore } from "@utils";

// hooks
import { useFirebase } from "@hooks/index";

// store
import useAuth from "@store/features/auth/use-auth";

const useLogin = () => {
    const auth = useAuth();
    const firebase = useFirebase();

    const onCheckLogin = useCallback(async (): Promise<void> => {
        const userData = await getItemAsyncSecureStore("userData");

        if (userData) {
            try {
                const user = JSON.parse(userData);
                const token = user.token;
                const userId = user.userId;
                const expiryDate = user.expiryDate ? new Date(user.expiryDate) : new Date();

                if (expiryDate <= new Date() || !token || !userId) {
                    throw { code: "permission_denied" };
                }

                const data = await firebase.getUserData({ userId });
                if (data && data.userId) {
                    auth.setAuthenticate({ token, userData: data });
                } else {
                    throw { code: "permission_denied" };
                }
            } catch (e) {
                ErrorHandler(e, "onCheckLogin");
            }
        }
    }, []);

    return { onCheckLogin };
};

export default useLogin;
