// react
import { useCallback, useMemo } from "react";

// hooks
import { useAppSelector, useAppDispatch } from "@hooks/index";

// store
import { setToken, setUserData } from "@store/features/auth/auth-slice";

// store
import { onLogout } from "@store/store-action";

const useAuth = () => {
    const dispatch = useAppDispatch();

    const token = useAppSelector(state => state.authReducer.token);
    const userData = useAppSelector(state => state.authReducer.userData);

    const isAuth = useMemo(() => token !== null && token !== "" && token !== undefined, [token]);

    const setTokenAction = useCallback((payload: { token: string | null }) => {
        dispatch(setToken(payload));
    }, []);

    const setUserDataAction = useCallback((payload: { userData: any }) => {
        dispatch(setUserData(payload));
    }, []);

    const setAuthenticate = useCallback((payload: { token: string | null; userData: any }) => {
        dispatch(setToken({ token: payload.token }));
        dispatch(setUserData({ userData: payload.userData }));
    }, []);

    const setLogoutAction = useCallback(() => {
        onLogout();
    }, []);

    return {
        setAuthenticate,
        setTokenAction,
        setUserDataAction,
        token,
        userData,
        isAuth,
        setLogoutAction
    };
};

export default useAuth;
