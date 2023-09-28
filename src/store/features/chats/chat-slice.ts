// modules
import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";

export interface ChatsState {
    chatsData: { [key: string]: any };
}

const initialState: ChatsState = {
    chatsData: {}
};

export const chatSlice = createSlice({
    name: "chats",
    initialState,
    reducers: {
        setChatsData: (state, action: PayloadAction<{ [key: string]: any }>) => {
            state.chatsData = action.payload;
        }
    }
});

// Action creators are generated for each case reducer function
export const { setChatsData } = chatSlice.actions;

export default chatSlice.reducer;
