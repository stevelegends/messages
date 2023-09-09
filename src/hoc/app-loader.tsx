// react
import React, { FC, Fragment, PropsWithChildren, useCallback, useEffect, useState } from "react";

// modules
import { ViewProps } from "react-native";
import * as SplashScreen from "expo-splash-screen";
import { GestureHandlerRootView } from "react-native-gesture-handler";

// hooks
import { useLoadFonts } from "@hooks/index";

// utils
import { wait } from "@utils";

SplashScreen.preventAutoHideAsync();

interface AppLoaderProps extends PropsWithChildren<ViewProps> {}

const AppLoader: FC<AppLoaderProps> = props => {
    useLoadFonts();

    const [isAppReady, setIsAppReady] = useState(false);

    async function prepare(): Promise<void> {
        await wait(2000);
        setIsAppReady(true);
    }

    const onLayoutRootView = useCallback(async () => {
        await SplashScreen.hideAsync();
    }, []);

    useEffect(() => {
        prepare();
    }, []);

    if (!isAppReady) {
        return <Fragment />;
    }

    return <GestureHandlerRootView onLayout={onLayoutRootView} {...props} />;
};

export default AppLoader;
