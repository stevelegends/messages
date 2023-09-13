// react
import React, { FC, Fragment, PropsWithChildren, useCallback, useEffect, useState } from "react";

// modules
import { ViewProps } from "react-native";
import * as SplashScreen from "expo-splash-screen";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { SafeAreaProvider } from "react-native-safe-area-context";

// hooks
import { useLoadFonts } from "@hooks/index";

// utils
import { wait } from "@utils";

SplashScreen.preventAutoHideAsync();

// language config
import { i18n } from "@lingui/core";
import { I18nProvider } from "@lingui/react";
import { messages } from "../locales/en/messages";

i18n.load("en", messages);
i18n.activate("en");

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
    return (
        <I18nProvider i18n={i18n}>
            <SafeAreaProvider>
                <GestureHandlerRootView onLayout={onLayoutRootView} {...props} />
            </SafeAreaProvider>
        </I18nProvider>
    );
};

export default AppLoader;
