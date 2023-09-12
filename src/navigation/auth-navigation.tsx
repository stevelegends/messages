// react
import React from "react";

// modules
import { createStackNavigator } from "@react-navigation/stack";
import { useTheme } from "@react-navigation/native";

// screens
import { SignInScreen, SignUpScreen } from "@screens";

// components
import ToggleThemeButton from "../components/toggle-theme-button";

export type AuthStackNavigatorParams = {
    SignInScreen: undefined;
    SignUpScreen: undefined;
};

const Stack = createStackNavigator<AuthStackNavigatorParams>();

const AuthNavigation = () => {
    const theme = useTheme();
    return (
        <Stack.Navigator initialRouteName="SignInScreen">
            <Stack.Screen
                options={{
                    title: "Sign Up",
                    headerShown: true,
                    headerStyle: {
                        backgroundColor: theme.colors.background
                    },
                    headerShadowVisible: false,
                    headerRight: () => <ToggleThemeButton />
                }}
                name="SignUpScreen"
                component={SignUpScreen}
            />
            <Stack.Screen
                options={{
                    title: "Sign In",
                    headerShown: true,
                    headerStyle: {
                        backgroundColor: theme.colors.background
                    },
                    headerShadowVisible: false,
                    headerRight: () => <ToggleThemeButton />
                }}
                name="SignInScreen"
                component={SignInScreen}
            />
        </Stack.Navigator>
    );
};

export default AuthNavigation;
