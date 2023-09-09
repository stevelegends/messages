// react
import React, { Fragment } from "react";

// modules
import { DefaultTheme, DarkTheme, NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";

// screens
import { ChatListScreen, ChatSettingsScreen, HomeScreen } from "@screens";

// contexts
import { useThemeProvider } from "@contexts/theme-context";

// components
import ToggleThemeButton from "../components/toggle-theme-button";
import { StatusBar } from "expo-status-bar";

export type StackNavigatorParams = {
    HomeScreen: undefined;
    ChatListScreen: undefined;
    ChatSettingsScreen: undefined;
};

const Stack = createStackNavigator<StackNavigatorParams>();

const AppTheme = {
    ...DefaultTheme,
    colors: {
        ...DefaultTheme.colors
    }
};

const Navigation = () => {
    const { isDark } = useThemeProvider();

    return (
        <Fragment>
            <StatusBar style={isDark ? "light" : "dark"} />
            <NavigationContainer theme={isDark ? DarkTheme : AppTheme}>
                <Stack.Navigator>
                    <Stack.Screen
                        options={{
                            title: "Home",
                            headerRight: () => <ToggleThemeButton />
                        }}
                        name="HomeScreen"
                        component={HomeScreen}
                    />
                    <Stack.Screen
                        options={{ title: "Chat" }}
                        name="ChatListScreen"
                        component={ChatListScreen}
                    />
                    <Stack.Screen
                        options={{ title: "Settings" }}
                        name="ChatSettingsScreen"
                        component={ChatSettingsScreen}
                    />
                </Stack.Navigator>
            </NavigationContainer>
        </Fragment>
    );
};

export default Navigation;
