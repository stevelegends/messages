import * as SplashScreen from "expo-splash-screen";

export const splashScreenPreventAutoHideAsync = () => {
    SplashScreen.preventAutoHideAsync();
};

export const splashScreenHideAsync = () => {
    SplashScreen.hideAsync();
};
