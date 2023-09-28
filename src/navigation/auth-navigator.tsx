// react
import React from "react";

// modules
import { useTheme } from "@react-navigation/native";
import { t } from "@lingui/macro";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

// screens
import { SignInScreen, SignUpScreen } from "@screens";

// components
import ToggleThemeButton from "../components/toggle-theme-button";

// hooks
import { useLingui } from "@lingui/react";

export type AuthStackNavigatorParams = {
    SignInScreen: undefined;
    SignUpScreen: undefined;
};

const Stack = createNativeStackNavigator<AuthStackNavigatorParams>();

const AuthNavigator = () => {
    const theme = useTheme();
    const { i18n } = useLingui();

    return (
        <Stack.Navigator
            initialRouteName="SignInScreen"
            screenOptions={{
                headerTitleStyle: {
                    fontFamily: "Roboto-Bold"
                }
            }}
        >
            <Stack.Screen
                options={{
                    title: t(i18n)`Sign Up`,
                    headerStyle: {
                        backgroundColor: theme.colors.background
                    },
                    gestureEnabled: false,
                    animation: "fade"
                }}
                name="SignUpScreen"
                component={SignUpScreen}
            />
            <Stack.Screen
                options={{
                    title: t(i18n)`Sign in`,
                    headerShown: true,
                    headerStyle: {
                        backgroundColor: theme.colors.background
                    },
                    headerRight: () => <ToggleThemeButton />,
                    gestureEnabled: false
                }}
                name="SignInScreen"
                component={SignInScreen}
            />
        </Stack.Navigator>
    );
};

export default AuthNavigator;
