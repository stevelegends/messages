// react
import React from "react";

// modules
import { createStackNavigator } from "@react-navigation/stack";
import { useTheme } from "@react-navigation/native";
import { t } from "@lingui/macro";

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

const Stack = createStackNavigator<AuthStackNavigatorParams>();

const AuthNavigation = () => {
    const theme = useTheme();
    const { i18n } = useLingui();

    return (
        <Stack.Navigator initialRouteName="SignInScreen">
            <Stack.Screen
                options={{
                    title: t(i18n)`Sign Up`,
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
                    title: t(i18n)`Sign in`,
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
