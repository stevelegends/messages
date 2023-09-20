// store
import { AppDispatch } from "./store";
import { setToken, setUserData } from "@store/features/auth/auth-slice";

// utils
import { removeItemAsyncStorage, deleteItemAsyncSecureStore } from "../utils/async-storage";

export const onLogout = () => {
    AppDispatch(setToken({ token: null }));
    AppDispatch(setUserData({ userData: null }));
    removeItemAsyncStorage("userData");
    deleteItemAsyncSecureStore("userData");
};
