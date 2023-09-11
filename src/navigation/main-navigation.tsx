import React from "react";

// modules
import { createStackNavigator } from "@react-navigation/stack";

// navigation
import BottomTabNavigation from "@navigation/bottom-tab-navigation";

// screens
import { SettingsScreen } from "@screens";

export type StackNavigatorParams = {
    BottomTab: undefined;
    SettingsScreen: undefined;
};

const Stack = createStackNavigator<StackNavigatorParams>();

const MainNavigation = () => {
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
                    title: "Chat",
                    headerBackTitle: "Back"
                }}
                name="SettingsScreen"
                component={SettingsScreen}
            />
        </Stack.Navigator>
    );
};

export default MainNavigation;