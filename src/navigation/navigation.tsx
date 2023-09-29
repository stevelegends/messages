// react
import React, { memo } from "react";

// modules
import { DefaultTheme, DarkTheme, NavigationContainer } from "@react-navigation/native";
import { StatusBar } from "expo-status-bar";

// contexts
import { useThemeProvider } from "@contexts/theme-context";

// navigation
import MainNavigator from "@navigation/main-navigator";
import AuthNavigator from "@navigation/auth-navigator";

// store
import useAuth from "@store/features/auth/use-auth";

// hoc
import AppLoading from "@hoc/app-loading";

const AppTheme = {
    ...DefaultTheme,
    colors: {
        ...DefaultTheme.colors
    }
};

const Navigation = memo(() => {
    const { isDark } = useThemeProvider();
    const auth = useAuth();

    return (
        <AppLoading>
            <StatusBar style={isDark ? "light" : "dark"} />
            <NavigationContainer theme={isDark ? DarkTheme : AppTheme}>
                {auth.isAuth ? <MainNavigator /> : undefined}
                {!auth.isAuth ? <AuthNavigator /> : undefined}
            </NavigationContainer>
        </AppLoading>
    );
});

export default Navigation;
