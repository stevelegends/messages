// react
import React, { FC, Fragment, PropsWithChildren, useCallback, useEffect, useState } from "react";

// modules
import { ViewProps } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { SafeAreaProvider } from "react-native-safe-area-context";

// utils
import { wait } from "@utils";

// load font config
import { useLoadFonts } from "@hooks/index";

// language config
import { i18n } from "@lingui/core";
import { I18nProvider } from "@lingui/react";
import { messages } from "../locales/en/messages";

// store config
import { Provider } from "react-redux";
import { store } from "@store/store";

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
        /**
         * deprecated
         * await SplashScreen.hideAsync();
         */
    }, []);

    useEffect(() => {
        prepare();
    }, []);

    if (!isAppReady) {
        return <Fragment />;
    }
    return (
        <Provider store={store}>
            <I18nProvider i18n={i18n}>
                <SafeAreaProvider>
                    <GestureHandlerRootView onLayout={onLayoutRootView} {...props} />
                </SafeAreaProvider>
            </I18nProvider>
        </Provider>
    );
};

export default AppLoader;
