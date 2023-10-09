// store
import { AppDispatch, resetAll } from "./store";
import { setClearToken, setClearUserData } from "@store/features/auth/auth-slice";

// utils
import { removeItemAsyncStorage, deleteItemAsyncSecureStore } from "../utils/async-storage";

export const onSignOut = () => {
    AppDispatch(setClearToken());
    AppDispatch(setClearUserData());
    resetAll();
    removeItemAsyncStorage("userData");
    deleteItemAsyncSecureStore("userData");
};
