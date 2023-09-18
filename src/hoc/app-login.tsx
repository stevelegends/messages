// react
import React, { FC, Fragment, ReactNode } from "react";

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

type AppLoginProps = {
    children: ReactNode;
};

const AppLogin: FC<AppLoginProps> = ({ children }) => {
    const { isDark } = useThemeProvider();
    const { isLoading } = useLogin();
    return (
        <Fragment>
            {children}
            {isLoading && (
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

export default AppLogin;
