// react
import { useCallback } from "react";

// actions
import {
    setMessagesData,
    addStarredMessages,
    removeStarredMessages,
    setStarredMessages
} from "./messages-slice";

// hooks
import { useAppSelector, useAppDispatch } from "@hooks/index";

const useMessages = () => {
    const dispatch = useAppDispatch();

    const messagesData = useAppSelector(state => state.messagesSlice.messagesData);
    const starredMessages = useAppSelector(state => state.messagesSlice.starredMessages);

    const setMessagesDataAction = useCallback(
        payload => dispatch(setMessagesData(payload)),
        []
    ) as (payload: { chatId: string; messagesData: any }) => void;

    const addStarredMessagesAction = useCallback(
        payload => dispatch(addStarredMessages(payload)),
        []
    ) as (payload: { messageId: string; starredMessages: any }) => void;

    const removeStarredMessagesAction = useCallback(
        payload => dispatch(removeStarredMessages(payload)),
        []
    ) as (payload: { messageId: string }) => void;

    const setStarredMessagesAction = useCallback(
        payload => dispatch(setStarredMessages(payload)),
        []
    ) as (payload: { [key: string]: any }) => void;

    return {
        messagesData,
        starredMessages,
        setMessagesDataAction,
        addStarredMessagesAction,
        removeStarredMessagesAction,
        setStarredMessagesAction
    };
};

export default useMessages;
