// modules
import { configureStore } from "@reduxjs/toolkit";

// reducer
import counterReducer from "@store/features/counter/counter-slice";
import authReducer from "@store/features/auth/auth-slice";
import userSlide from "@store/features/user/user-slice";

export const store = configureStore({
    reducer: {
        counterReducer,
        authReducer,
        userSlide
    }
});

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;

// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch;
export const AppDispatch = store.dispatch;
