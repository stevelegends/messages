import { useCallback, useEffect } from "react";

// modules
import { AppState } from "react-native";

// constants
import { UserStatus } from "@constants/user-status";

const useUserState = (callback: (status: UserStatus, deps: any) => void, deps: any) => {
    const handleAppStateChange = useCallback(
        (nextAppState: any) => {
            if (nextAppState.match(/inactive|background/)) {
                callback(UserStatus.inactive, deps);
            }
            if (nextAppState === "active") {
                callback(UserStatus.active, deps);
            }
        },
        [deps]
    );

    useEffect(() => {
        if (deps) {
            callback(UserStatus.active, deps);
            const appStateListener = AppState.addEventListener("change", handleAppStateChange);
            return () => {
                callback(UserStatus.inactive, deps);
                appStateListener.remove();
            };
        }
    }, [deps]);
};

export default useUserState;
