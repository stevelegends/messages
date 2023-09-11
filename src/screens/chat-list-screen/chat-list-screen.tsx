// react
import React, { FC } from "react";

// modules
import { StackNavigationProp } from "@react-navigation/stack";
import { Button, View } from "react-native";

// styles
import styles from "./chat-list-screen.styles";

// navigation
import { BottomTabStackNavigatorParams } from "@navigation/bottom-tab-navigation";

// components
import { Text } from "@components";

// hooks
import { useNavigation } from "@hooks/index";

type ChatListScreenProps = {
    navigation: StackNavigationProp<BottomTabStackNavigatorParams, "ChatListScreen">;
};

const ChatListScreen: FC<ChatListScreenProps> = () => {
    const { navigate } = useNavigation();
    return (
        <View style={styles.container}>
            <Text>Chat</Text>
            <Button title="Chat" onPress={() => navigate("ChatScreen")} />
        </View>
    );
};

export default ChatListScreen;
