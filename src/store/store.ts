// modules
import { configureStore } from "@reduxjs/toolkit";

// reducer
import counterReducer from "@store/features/counter/counter-slice";
import authReducer, { resetState as resetAuth } from "@store/features/auth/auth-slice";
import userSlide, { resetState as resetUser } from "@store/features/user/user-slice";
import chatsSlide, { resetState as resetChats } from "@store/features/chats/chat-slice";
import messagesSlice, {
    resetState as resetMessages
} from "@store/features/messages/messages-slice";

export const store = configureStore({
    reducer: {
        counterReducer,
        authReducer,
        userSlide,
        chatsSlide,
        messagesSlice
    }
});

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;

// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch;
export const AppDispatch = store.dispatch;

export const resetAll = () => {
    AppDispatch(resetAuth());
    AppDispatch(resetUser());
    AppDispatch(resetChats());
    AppDispatch(resetMessages());
};
