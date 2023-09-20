// utils
import { deleteItemAsyncSecureStore, removeItemAsyncStorage } from "./async-storage";

// store
import { AppDispatch } from "@store/store";
import { setToken, setUserData } from "@store/features/auth/auth-slice";

export const onLogout = () => {
    AppDispatch(setToken({ token: null }));
    AppDispatch(setUserData({ userData: null }));
    removeItemAsyncStorage("userData");
    deleteItemAsyncSecureStore("userData");
};
