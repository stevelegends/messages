// react
import React, { FC } from "react";

// modules
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { StackNavigationProp } from "@react-navigation/stack";
import { Ionicons } from "@expo/vector-icons";

// screens
import { ChatListScreen, ChatSettingsScreen } from "@screens";

// components
import ToggleThemeButton from "../components/toggle-theme-button";

// navigation
import { StackNavigatorParams } from "@navigation/main-navigation";

export type BottomTabStackNavigatorParams = {
    ChatListScreen: undefined;
    ChatSettingsScreen: undefined;
};

const Tab = createBottomTabNavigator<BottomTabStackNavigatorParams>();

type BottomTabNavigationProps = {
    navigation: StackNavigationProp<StackNavigatorParams, "BottomTab">;
};

const BottomTabNavigation: FC<BottomTabNavigationProps> = () => {
    return (
        <Tab.Navigator>
            <Tab.Screen
                options={{
                    title: "Chat",
                    tabBarLabel: "Chats",
                    tabBarIcon: ({ size, color }) => (
                        <Ionicons name="chatbubble-outline" size={size} color={color} />
                    )
                }}
                name="ChatListScreen"
                component={ChatListScreen}
            />
            <Tab.Screen
                options={{
                    title: "Settings",
                    tabBarLabel: "Settings",
                    tabBarIcon: ({ size, color }) => (
                        <Ionicons name="settings-outline" size={size} color={color} />
                    ),
                    headerRight: () => <ToggleThemeButton />
                }}
                name="ChatSettingsScreen"
                component={ChatSettingsScreen}
            />
        </Tab.Navigator>
    );
};

export default BottomTabNavigation;
