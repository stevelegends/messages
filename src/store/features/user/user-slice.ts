// modules
import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";

export interface UserState {
    storedUsers: { [key: string]: any };
}

const initialState: UserState = {
    storedUsers: {}
};

export const userSlice = createSlice({
    name: "user",
    initialState,
    reducers: {
        setStoredUsersOverride: (state, action: PayloadAction<{ [key: string]: any }>) => {
            const newUser = action.payload;
            const existingUsers = state.storedUsers;

            const usersArray = Object.values(newUser);
            for (let i = 0; i < usersArray.length; i++) {
                const userData = usersArray[i];
                existingUsers[userData.userId] = userData;
            }

            state.storedUsers = existingUsers;
        },
        setStoredUsers: (state, action: PayloadAction<{ [key: string]: any }>) => {
            state.storedUsers = action.payload;
        }
    }
});

// Action creators are generated for each case reducer function
export const { setStoredUsersOverride, setStoredUsers } = userSlice.actions;

export default userSlice.reducer;
