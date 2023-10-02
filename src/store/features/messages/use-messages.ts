// react
import { useCallback } from "react";

// actions
import { setMessagesData } from "./messages-slice";

// hooks
import { useAppSelector, useAppDispatch } from "@hooks/index";

const useMessages = () => {
    const dispatch = useAppDispatch();

    const messagesData = useAppSelector(state => state.messagesSlice.messagesData);

    const setMessagesDataAction = useCallback(
        payload => dispatch(setMessagesData(payload)),
        []
    ) as (payload: { chatId: string; messagesData: any }) => void;

    return {
        messagesData,
        setMessagesDataAction
    };
};

export default useMessages;
