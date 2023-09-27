// react
import { useCallback } from "react";

// actions
import { setStoredUsersOverride, setStoredUsers } from "./user-slice";

// hooks
import { useAppSelector, useAppDispatch } from "@hooks/index";

const useUser = () => {
    const dispatch = useAppDispatch();

    const storedUsers = useAppSelector(state => state.userSlide.storedUsers);

    const setStoredUsersOverrideAction = useCallback(payload => {
        dispatch(setStoredUsersOverride(payload));
    }, []) as (payload: { [key: string]: any }) => void;

    const setStoredUsersAction = useCallback(payload => {
        dispatch(setStoredUsers(payload));
    }, []) as (payload: { [key: string]: any }) => void;

    return {
        storedUsers,
        setStoredUsersAction,
        setStoredUsersOverrideAction
    };
};

export default useUser;
