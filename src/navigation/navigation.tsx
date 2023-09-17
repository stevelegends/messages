// react
import React, { Fragment } from "react";

// modules
import { DefaultTheme, DarkTheme, NavigationContainer } from "@react-navigation/native";
import { StatusBar } from "expo-status-bar";

// contexts
import { useThemeProvider } from "@contexts/theme-context";

// navigation
import MainNavigation from "@navigation/main-navigation";
import AuthNavigation from "@navigation/auth-navigation";

// store
import useAuth from "@store/features/auth/use-auth";

const AppTheme = {
    ...DefaultTheme,
    colors: {
        ...DefaultTheme.colors
    }
};

const Navigation = () => {
    const { isDark } = useThemeProvider();

    const { isAuth } = useAuth();

    return (
        <Fragment>
            <StatusBar style={isDark ? "light" : "dark"} />
            <NavigationContainer theme={isDark ? DarkTheme : AppTheme}>
                {isAuth ? <MainNavigation /> : undefined}
                {!isAuth ? <AuthNavigation /> : undefined}
            </NavigationContainer>
        </Fragment>
    );
};

export default Navigation;
