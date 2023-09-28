// react
import React, { FC, useCallback, useEffect, useMemo } from "react";

// modules
import { StackNavigationProp } from "@react-navigation/stack";
import { FlatList, View } from "react-native";
import { RouteProp } from "@react-navigation/native";

// styles
import styles from "./chat-list-screen.styles";

// navigation
import { BottomTabStackNavigatorParams } from "@navigation/bottom-tab-navigator";

// components
import { CreateButton } from "@components";

// hooks
import { useNavigation } from "@hooks/index";

// store
import useAuth from "@store/features/auth/use-auth";
import useChats from "@store/features/chats/use-chats";
import useUser from "@store/features/user/use-user";
import ItemListView from "../new-chat-screen/components/item-list-view";

type ChatListScreenProps = {
    navigation: StackNavigationProp<BottomTabStackNavigatorParams, "ChatListScreen">;
    route: RouteProp<BottomTabStackNavigatorParams, "ChatListScreen">;
};

const ChatListScreen: FC<ChatListScreenProps> = ({ navigation, route }) => {
    const { navigate } = useNavigation();
    const auth = useAuth();
    const chats = useChats();
    const user = useUser();

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

            navigate("ChatScreen", {
                newChatData: {
                    users: [route.params.selectedUserId, auth.userData.userId]
                }
            });
        }
        handleSelectedUserFromNewChatScreen();
    }, [route.params?.selectedUserId]);

    useEffect(() => {
        navigation.setOptions({
            headerRight: () => <CreateButton onPress={() => navigate("NewChatScreen")} />
        });
    }, []);

    return (
        <View style={styles.container}>
            <FlatList
                data={sortedChatsData}
                renderItem={({ item, index }) => {
                    const chatId = item.key;

                    const otherUserId = (item.users as string[]).find(
                        uid => uid !== auth.userData?.userId
                    );
                    if (!otherUserId) return null;
                    const otherUser = user.storedUsers[otherUserId];
                    if (!otherUser) return null;

                    return (
                        <ItemListView
                            id={chatId}
                            index={index}
                            title={otherUser.firstName + " " + otherUser.lastName}
                            subTitle={otherUser.about}
                            image={otherUser.profilePicture}
                            onPress={handleItemOnPress}
                        />
                    );
                }}
                keyExtractor={(item, index) => item.key || index.toString()}
            />
        </View>
    );
};

export default ChatListScreen;
