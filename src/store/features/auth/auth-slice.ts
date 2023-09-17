// modules
import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";

export interface AuthState {
    token: string | null;
    userData: any | null;
}

const initialState: AuthState = {
    token: null,
    userData: null
};

export const authSlice = createSlice({
    name: "auth",
    initialState,
    reducers: {
        setToken: (state, action: PayloadAction<{ token: string }>) => {
            state.token = action.payload.token;
        },
        setUserData: (state, action: PayloadAction<{ userData: any }>) => {
            state.userData = action.payload.userData;
        }
    }
});

// Action creators are generated for each case reducer function
export const setToken = authSlice.actions.setToken;
export const setUserData = authSlice.actions.setUserData;

export default authSlice.reducer;
