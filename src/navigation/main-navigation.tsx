import React from "react";

// modules
import { createStackNavigator } from "@react-navigation/stack";
import { t } from "@lingui/macro";

// navigation
import BottomTabNavigation from "@navigation/bottom-tab-navigation";

// screens
import { ChatScreen, SettingsScreen } from "@screens";

// hooks
import { useLingui } from "@lingui/react";

export type StackNavigatorParams = {
    BottomTab: undefined;
    SettingsScreen: undefined;
    ChatScreen: undefined;
};

const Stack = createStackNavigator<StackNavigatorParams>();

const MainNavigation = () => {
    const { i18n } = useLingui();
    return (
        <Stack.Navigator>
            <Stack.Screen
                options={{
                    headerShown: false
                }}
                name="BottomTab"
                component={BottomTabNavigation}
            />
            <Stack.Screen
                options={{
                    title: t(i18n)`Chat`,
                    headerBackTitle: "Back"
                }}
                name="ChatScreen"
                component={ChatScreen}
            />
            <Stack.Screen
                options={{
                    title: t(i18n)`Settings`,
                    headerBackTitle: "Back"
                }}
                name="SettingsScreen"
                component={SettingsScreen}
            />
        </Stack.Navigator>
    );
};

export default MainNavigation;
