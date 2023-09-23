// react
import React, { FC, Fragment, ReactNode, useEffect } from "react";

// modules
import { ActivityIndicator, StyleSheet } from "react-native";
import { DarkTheme, DefaultTheme } from "@react-navigation/native";
import Animated from "react-native-reanimated";

// hooks
import useLogin from "@hooks/use-login";

// contexts
import { useThemeProvider } from "@contexts/theme-context";

// theme
import { globalStyles } from "@theme/theme";

// utils
import { ErrorHandler, isRootedExperimentalAsync, splashScreenHideAsync } from "@utils";

type AppLoginProps = {
    children: ReactNode;
};

const AppLoading: FC<AppLoginProps> = ({ children }) => {
    const { isDark } = useThemeProvider();
    const { onCheckLogin } = useLogin();

    useEffect(() => {
        async function handleOnCheckLogin() {
            const isJailBreak = await isRootedExperimentalAsync();
            if (isJailBreak) {
                ErrorHandler(
                    { code: "device-rooted-jailbroken" },
                    "app-loading/handleOnCheckLogin"
                );
                return;
            }

            await onCheckLogin();
            splashScreenHideAsync();
        }
        handleOnCheckLogin();
    }, []);

    return (
        <Fragment>
            {children}
            {false && (
                <Animated.View
                    style={[
                        StyleSheet.absoluteFill,
                        globalStyles["flex-center"],
                        {
                            backgroundColor: isDark
                                ? DarkTheme.colors.background
                                : DefaultTheme.colors.background
                        }
                    ]}
                >
                    <ActivityIndicator
                        color={isDark ? DarkTheme.colors.text : DefaultTheme.colors.text}
                    />
                </Animated.View>
            )}
        </Fragment>
    );
};

export default AppLoading;
