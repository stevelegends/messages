// react
import React, { FC, useCallback, useEffect, useMemo } from "react";

// modules
import { StackNavigationProp } from "@react-navigation/stack";
import { FlatList, View } from "react-native";
import { RouteProp } from "@react-navigation/native";
import { t } from "@lingui/macro";

// styles
import styles from "./chat-list-screen.styles";

// navigation
import { BottomTabStackNavigatorParams } from "@navigation/bottom-tab-navigator";

// components
import { CreateButton } from "@components";
import { NewGroupButtonText } from "@molecules";

// hooks
import { useNavigation } from "@hooks/index";
import { useLingui } from "@lingui/react";

// store
import useAuth from "@store/features/auth/use-auth";
import useChats from "@store/features/chats/use-chats";
import useUser from "@store/features/user/use-user";
import ItemListView from "../new-chat-screen/components/item-list-view";

// contexts
import { useNotificationProvider } from "@contexts/notification-context";

// constants
import { UserStatus } from "@constants/user-status";
import { globalStyles } from "@theme/theme";

type ChatListScreenProps = {
    navigation: StackNavigationProp<BottomTabStackNavigatorParams, "ChatListScreen">;
    route: RouteProp<BottomTabStackNavigatorParams, "ChatListScreen">;
};

const ChatListScreen: FC<ChatListScreenProps> = ({ navigation, route }) => {
    const { navigate } = useNavigation();
    const { i18n } = useLingui();
    const auth = useAuth();
    const chats = useChats();
    const user = useUser();
    const { addStack } = useNotificationProvider();

    const sortedChatsData = useMemo(() => {
        if (chats.chatsData && Array.isArray(Object.values(chats.chatsData))) {
            return Object.values(chats.chatsData).sort((a, b) => {
                return new Date(b.updatedAt).valueOf() - new Date(a.updatedAt).valueOf();
            });
        }
        return [];
    }, [chats.chatsData]);

    const handleItemOnPress = useCallback(
        id => {
            navigate("ChatScreen", { chatId: id });
        },
        [user.storedUsers]
    ) as (id: string) => void;

    useEffect(() => {
        function handleSelectedUserFromNewChatScreen() {
            if (!route.params?.selectedUserId || !auth.userData?.userId) return;
            navigation.setParams({ selectedUserId: undefined });

            const existingChatUser = sortedChatsData.find(value => {
                return !value.isGroupChat && value.users.includes(route.params.selectedUserId);
            });
            const existingChatId = existingChatUser && existingChatUser.key;

            if (existingChatId) {
                navigate("ChatScreen", { chatId: existingChatId });
                return;
            }

            navigate("ChatScreen", {
                newChatData: {
                    users: [route.params.selectedUserId, auth.userData.userId]
                }
            });
        }
        handleSelectedUserFromNewChatScreen();
    }, [route.params?.selectedUserId, sortedChatsData]);

    useEffect(() => {
        function handleSelectedUsersGroupFromNewChatScreen() {
            if (!route.params?.selectedUsers || !route.params?.chatName || !auth.userData?.userId)
                return;
            navigation.setParams({ selectedUsers: undefined, chatName: undefined });

            const selectedUsers = route.params.selectedUsers;
            const userId = auth.userData.userId;

            if (!selectedUsers.includes(userId)) {
                selectedUsers.push(userId);
            }

            navigate("ChatScreen", {
                newChatData: {
                    users: selectedUsers,
                    isGroupChat: true,
                    chatName: route.params.chatName
                }
            });
        }
        handleSelectedUsersGroupFromNewChatScreen();
    }, [route.params?.selectedUsers]);

    useEffect(() => {
        navigation.setOptions({
            headerRight: () => (
                <View style={globalStyles["flex-row"]}>
                    <CreateButton onPress={() => navigate("NewChatScreen")} />
                </View>
            )
        });
    }, []);

    return (
        <View style={styles.container}>
            <NewGroupButtonText
                style={{ marginLeft: 8 }}
                titleStyle={{ fontSize: 16 }}
                onPress={() => navigate("NewChatScreen", { isGroupChat: true })}
            />
            <FlatList
                data={sortedChatsData}
                renderItem={({ item, index }) => {
                    const chatId = item.key;
                    const isGroupChat = item.isGroupChat;

                    const otherUserId = (item.users as string[]).find(
                        uid => uid !== auth.userData?.userId
                    );
                    if (!otherUserId) return null;
                    const otherUser = user.storedUsers[otherUserId];
                    if (!otherUser) return null;
                    const statuses = Object.values(otherUser.session).map(ss => (ss as any).status);
                    const status = statuses.includes(UserStatus.active)
                        ? UserStatus.active
                        : UserStatus.inactive;
                    return (
                        <ItemListView
                            id={chatId}
                            index={index}
                            title={
                                isGroupChat
                                    ? item.chatName
                                    : otherUser.firstName + " " + otherUser.lastName
                            }
                            subTitle={item.latestMessageText || t(i18n)`New chat`}
                            image={isGroupChat ? null : otherUser.profilePicture}
                            onPress={handleItemOnPress}
                            status={isGroupChat ? UserStatus.inactive : status}
                        />
                    );
                }}
                keyExtractor={(item, index) => item.key || index.toString()}
            />
        </View>
    );
};

export default ChatListScreen;
