import React from "react";

// modules
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { t } from "@lingui/macro";

// navigation
import BottomTabNavigation from "@navigation/bottom-tab-navigation";

// screens
import { ChatScreen, NewChatScreen, ReviewImageModal, SettingsScreen } from "@screens";

// hooks
import { useLingui } from "@lingui/react";

export type StackNavigatorParams = {
    BottomTab: undefined;
    SettingsScreen: undefined;
    ChatScreen: undefined;
    ReviewImageModal: {
        url: string;
    };
    NewChatScreen: undefined;
};

const Stack = createNativeStackNavigator<StackNavigatorParams>();

const MainNavigation = () => {
    const { i18n } = useLingui();
    return (
        <Stack.Navigator
            screenOptions={{
                headerTitleStyle: {
                    fontFamily: "Roboto-Bold"
                }
            }}
        >
            <Stack.Group>
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
                        headerBackTitle: t(i18n)`Back`,
                        animation: "slide_from_right"
                    }}
                    name="ChatScreen"
                    component={ChatScreen}
                />

                <Stack.Screen
                    options={{
                        title: t(i18n)`Settings`,
                        headerBackTitle: t(i18n)`Back`
                    }}
                    name="SettingsScreen"
                    component={SettingsScreen}
                />
            </Stack.Group>

            <Stack.Group screenOptions={{ presentation: "containedModal" }}>
                <Stack.Screen
                    options={{
                        title: t(i18n)`New Chat`,
                        headerTitleAlign: "center"
                    }}
                    name="NewChatScreen"
                    component={NewChatScreen}
                />
            </Stack.Group>

            <Stack.Group screenOptions={{ presentation: "containedTransparentModal" }}>
                <Stack.Screen
                    options={{
                        headerShown: false,
                        animation: "fade"
                    }}
                    name="ReviewImageModal"
                    component={ReviewImageModal}
                />
            </Stack.Group>
        </Stack.Navigator>
    );
};

export default MainNavigation;
