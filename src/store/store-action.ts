// store
import { AppDispatch } from "./store";
import { setClearToken, setClearUserData } from "@store/features/auth/auth-slice";

// utils
import { removeItemAsyncStorage, deleteItemAsyncSecureStore } from "../utils/async-storage";

export const onSignOut = () => {
    AppDispatch(setClearToken());
    AppDispatch(setClearUserData());
    removeItemAsyncStorage("userData");
    deleteItemAsyncSecureStore("userData");
};
