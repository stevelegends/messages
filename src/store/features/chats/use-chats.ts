// react
import { useCallback } from "react";

// actions
import { setChatsData } from "./chat-slice";

// hooks
import { useAppSelector, useAppDispatch } from "@hooks/index";

const useChats = () => {
    const dispatch = useAppDispatch();

    const chatsData = useAppSelector(state => state.chatsSlide.chatsData);

    const setChatsDataAction = useCallback(payload => {
        dispatch(setChatsData(payload));
    }, []) as (payload: { [key: string]: any }) => void;

    return {
        chatsData,
        setChatsDataAction
    };
};

export default useChats;
