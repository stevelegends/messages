// react
import React, { FC, Fragment, useCallback, useEffect, useState } from "react";

// modules
import { View, ViewProps } from "react-native";
import * as SplashScreen from "expo-splash-screen";

// hooks
import useLoadFonts from "@hooks/use-load-fonts";

// utils
import { wait } from "@utils";

SplashScreen.preventAutoHideAsync();

type AppLoaderProps = object & ViewProps;

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

    return <View onLayout={onLayoutRootView} {...props} />;
};

export default AppLoader;
