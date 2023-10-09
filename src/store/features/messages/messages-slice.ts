// modules
import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";

export interface MessagesState {
    messagesData: { [key: string]: any };
    starredMessages: { [key: string]: any };
}

const initialState: MessagesState = {
    messagesData: {},
    starredMessages: {}
};

export const messagesSlice = createSlice({
    name: "messages",
    initialState,
    reducers: {
        setMessagesData: (state, action: PayloadAction<{ chatId: string; messagesData: any }>) => {
            const existingMessagesData = state.messagesData;

            const { chatId, messagesData } = action.payload;
            existingMessagesData[chatId] = messagesData;

            state.messagesData = existingMessagesData;
        },
        addStarredMessages: (
            state,
            action: PayloadAction<{ messageId: string; starredMessages: { [key: string]: any } }>
        ) => {
            state.starredMessages[action.payload.messageId] = action.payload.starredMessages;
        },
        removeStarredMessages: (state, action: PayloadAction<{ messageId: string }>) => {
            delete state.starredMessages[action.payload.messageId];
        },
        setStarredMessages: (state, action: PayloadAction<{ [key: string]: any }>) => {
            state.starredMessages = { ...action.payload };
        },
        resetState: () => {
            return initialState;
        }
    }
});

// Action creators are generated for each case reducer function
export const {
    resetState,
    setMessagesData,
    addStarredMessages,
    removeStarredMessages,
    setStarredMessages
} = messagesSlice.actions;

export default messagesSlice.reducer;
