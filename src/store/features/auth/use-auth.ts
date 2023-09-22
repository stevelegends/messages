// react
import { useCallback, useMemo } from "react";

// hooks
import { useAppSelector, useAppDispatch } from "@hooks/index";

// store
import { setToken, setUserData, setStatus } from "@store/features/auth/auth-slice";

// store
import { onSignOut } from "@store/store-action";

// constants
import { UserStatus } from "@constants/user-status";

const useAuth = () => {
    const dispatch = useAppDispatch();

    const token = useAppSelector(state => state.authReducer.token);
    const userData = useAppSelector(state => state.authReducer.userData);
    const status = useAppSelector(state => state.authReducer.status);

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
        onSignOut();
    }, []);

    const setStatusAction = useCallback((payload: { status: UserStatus }) => {
        dispatch(setStatus(payload));
    }, []);

    return {
        setAuthenticate,
        setTokenAction,
        setUserDataAction,
        token,
        userData,
        isAuth,
        setLogoutAction,
        status,
        setStatusAction
    };
};

export default useAuth;
