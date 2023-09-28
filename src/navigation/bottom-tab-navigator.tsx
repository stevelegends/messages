// react
import React, { FC } from "react";

// modules
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { StackNavigationProp } from "@react-navigation/stack";
import { Ionicons } from "@expo/vector-icons";
import { t } from "@lingui/macro";
import { View } from "react-native";

// screens
import { ChatListScreen, ChatSettingsScreen } from "@screens";

// components
import ToggleThemeButton from "../components/toggle-theme-button";

// navigation
import { StackNavigatorParams } from "@navigation/main-navigator";

// hooks
import { useLingui } from "@lingui/react";
import { useTheme } from "@react-navigation/native";

// theme
import { globalSize } from "@theme/theme";

export type BottomTabStackNavigatorParams = {
    ChatListScreen: { selectedUserId?: string };
    ChatSettingsScreen: undefined;
};

const BottomTab = createBottomTabNavigator<BottomTabStackNavigatorParams>();

type BottomTabNavigationProps = {
    navigation: StackNavigationProp<StackNavigatorParams, "BottomTab">;
};

const BottomTabNavigator: FC<BottomTabNavigationProps> = () => {
    const { i18n } = useLingui();
    const theme = useTheme();

    return (
        <BottomTab.Navigator
            screenOptions={{
                headerShown: true,
                headerTitleAlign: "left",
                headerTitleStyle: {
                    fontFamily: "Roboto-Bold",
                    fontSize: globalSize.headerTitle
                },
                headerShadowVisible: false,
                headerBackground: () => (
                    <View style={{ backgroundColor: theme.colors.background }} />
                )
            }}
        >
            <BottomTab.Screen
                options={{
                    title: t(i18n)`Chats`,
                    tabBarLabel: "Chats",
                    tabBarIcon: ({ size, color }) => (
                        <Ionicons name="chatbubble-outline" size={size} color={color} />
                    )
                }}
                name="ChatListScreen"
                component={ChatListScreen}
            />
            <BottomTab.Screen
                options={{
                    title: t(i18n)`Settings`,
                    tabBarLabel: "Settings",
                    tabBarIcon: ({ size, color }) => (
                        <Ionicons name="settings-outline" size={size} color={color} />
                    ),
                    headerRight: () => <ToggleThemeButton />
                }}
                name="ChatSettingsScreen"
                component={ChatSettingsScreen}
            />
        </BottomTab.Navigator>
    );
};

export default BottomTabNavigator;
