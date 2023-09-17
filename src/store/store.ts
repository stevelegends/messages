// modules
import { configureStore } from "@reduxjs/toolkit";

// reducer
import counterReducer from "@store/features/counter/counter-slice";
import authReducer from "@store/features/auth/auth-slice";

export const store = configureStore({
    reducer: {
        counterReducer,
        authReducer
    }
});

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;

// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch;
