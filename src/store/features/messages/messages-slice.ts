// modules
import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";

export interface MessagesState {
    messagesData: { [key: string]: any };
}

const initialState: MessagesState = {
    messagesData: {}
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
        }
    }
});

// Action creators are generated for each case reducer function
export const { setMessagesData } = messagesSlice.actions;

export default messagesSlice.reducer;
