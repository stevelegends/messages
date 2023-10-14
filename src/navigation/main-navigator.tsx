import React, { useCallback, useEffect } from "react";

// modules
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { t } from "@lingui/macro";

// navigation
import BottomTabNavigator from "@navigation/bottom-tab-navigator";

// screens
import { ChatScreen, NewChatScreen, ReviewImageModal, SettingsScreen } from "@screens";

// hooks
import { useLingui } from "@lingui/react";
import { useFirebase, useUserState } from "@hooks/index";

// store
import useAuth from "@store/features/auth/use-auth";
import useChats from "@store/features/chats/use-chats";
import useUser from "@store/features/user/use-user";
import useMessages from "@store/features/messages/use-messages";

// constants
import { UserStatus } from "@constants/user-status";

export type StackNavigatorParams = {
    BottomTab: undefined;
    SettingsScreen: undefined;
    ChatScreen: {
        newChatData?: { users: string[] };
        chatId?: string;
    };
    ReviewImageModal: {
        url: string;
    };
    NewChatScreen?: {
        isGroupChat?: boolean;
    };
};

const Stack = createNativeStackNavigator<StackNavigatorParams>();

const StackNavigator = () => {
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
                    component={BottomTabNavigator}
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

const MainNavigator = () => {
    const { userData, setStatusAction } = useAuth();
    const {
        onUserChatsListener,
        onUpdateSignedInUserStatusData,
        onUnSubscribeFromListener,
        onChatsListener,
        getUserDataAsync,
        onMessagesListener,
        onUserStarredMessagesListener
    } = useFirebase();
    const chats = useChats();
    const { setStoredUsersOverrideAction, storedUsers } = useUser();
    const { setMessagesDataAction, setStarredMessagesAction } = useMessages();

    const onUserStatus = useCallback((status, deps) => {
        if (!deps?.userId) return;
        __DEV__ && console.log("onUserStatus", status, deps.userId);
        const userId = deps.userId as string;
        const session = deps.session || {};
        onUpdateSignedInUserStatusData({ userId, status, session }, undefined);
        setStatusAction({ status });
    }, []) as (status: UserStatus, deps: any) => any;

    useEffect(() => {
        if (userData?.userId) {
            __DEV__ &&
                console.log("Subscribing to firebase listeners with userId: ", userData?.userId);
            const refs: any[] = [];
            const userChatsListener = onUserChatsListener(userData.userId, chatIds => {
                const chatsData: { [key: string]: any } = {};
                let chatsFoundCount = 0;

                for (let i = 0; i < chatIds.length; i++) {
                    const chatId = chatIds[i] as string;
                    const chatRef = onChatsListener(chatId, dataSnapshot => {
                        chatsFoundCount++;

                        const data = dataSnapshot.val();
                        if (data && dataSnapshot.key) {
                            data.key = dataSnapshot.key;

                            if (Array.isArray(data.users)) {
                                (data.users as string[]).forEach(userId => {
                                    if (storedUsers[userId]) return;
                                    getUserDataAsync({ userId }).then(userSnapshotData => {
                                        setStoredUsersOverrideAction({
                                            [userSnapshotData.userId]: userSnapshotData
                                        });
                                    });
                                });
                            }

                            chatsData[dataSnapshot.key] = data;
                        }

                        if (chatsFoundCount >= chatIds.length) {
                            chats.setChatsDataAction(chatsData);
                            // set loading false
                        }
                    });

                    const messagesRef = onMessagesListener(chatId, dataSnapshot => {
                        const messagesData = dataSnapshot.val();
                        setMessagesDataAction({ chatId, messagesData });
                    });

                    if (chatsFoundCount === 0) {
                        // set loading false
                    }

                    refs.push(messagesRef);
                    refs.push(chatRef);
                }
            });

            const userStarredMessagesListener = onUserStarredMessagesListener(
                userData.userId,
                dataSnapshot => {
                    setStarredMessagesAction(dataSnapshot.val() || {});
                }
            );

            refs.push(userStarredMessagesListener);

            refs.push(userChatsListener);

            return () => {
                __DEV__ &&
                    console.log(
                        "UnSubscribing to firebase listeners with userId: ",
                        userData?.userId
                    );
                refs.forEach(ref => onUnSubscribeFromListener(ref));
            };
        }
    }, [userData?.userId]);

    useUserState(onUserStatus, userData);

    return <StackNavigator />;
};

export default MainNavigator;
