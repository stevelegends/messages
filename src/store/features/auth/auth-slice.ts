// modules
import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";

import { UserStatus } from "@constants/user-status";

export interface AuthState {
    token: string | null;
    userData: any | null;
    status: UserStatus | null;
}

const initialState: AuthState = {
    token: null,
    userData: null,
    status: null
};

export const authSlice = createSlice({
    name: "auth",
    initialState,
    reducers: {
        setToken: (state, action: PayloadAction<{ token: string | null }>) => {
            state.token = action.payload.token;
        },
        setUserData: (state, action: PayloadAction<{ userData: any }>) => {
            __DEV__ && console.log("updated user data: ", action.payload.userData);
            state.userData = action.payload.userData;
        },
        setStatus: (state, action: PayloadAction<{ status: UserStatus }>) => {
            state.status = action.payload.status;
        }
    }
});

// Action creators are generated for each case reducer function
export const setToken = authSlice.actions.setToken;
export const setUserData = authSlice.actions.setUserData;
export const setStatus = authSlice.actions.setStatus;

export default authSlice.reducer;
