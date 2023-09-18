// react
import React from "react";

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

// hoc
import AppLogin from "@hoc/app-login";

const AppTheme = {
    ...DefaultTheme,
    colors: {
        ...DefaultTheme.colors
    }
};

const Navigation = () => {
    const { isDark } = useThemeProvider();
    const auth = useAuth();

    return (
        <AppLogin>
            <StatusBar style={isDark ? "light" : "dark"} />
            <NavigationContainer theme={isDark ? DarkTheme : AppTheme}>
                {auth.isAuth ? <MainNavigation /> : undefined}
                {!auth.isAuth ? <AuthNavigation /> : undefined}
            </NavigationContainer>
        </AppLogin>
    );
};

export default Navigation;
