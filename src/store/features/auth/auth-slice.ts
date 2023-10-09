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
            // __DEV__ && console.log("updated user data to store: ", action.payload.userData);
            state.userData = action.payload.userData;
        },
        setClearUserData: state => {
            state.userData = null;
        },
        setClearToken: state => {
            state.token = null;
        },
        setStatus: (state, action: PayloadAction<{ status: UserStatus }>) => {
            state.status = action.payload.status;
        },
        resetState: () => {
            return initialState;
        }
    }
});

// Action creators are generated for each case reducer function
export const resetState = authSlice.actions.resetState;
export const setToken = authSlice.actions.setToken;
export const setUserData = authSlice.actions.setUserData;
export const setClearToken = authSlice.actions.setClearToken;
export const setClearUserData = authSlice.actions.setClearUserData;
export const setStatus = authSlice.actions.setStatus;

export default authSlice.reducer;
