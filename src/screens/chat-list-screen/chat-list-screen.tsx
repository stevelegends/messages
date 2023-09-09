// react
import React, { FC } from "react";

// modules
import { StackNavigationProp } from "@react-navigation/stack";
import { StackNavigatorParams } from "@navigation/navigation";
import { View } from "react-native";

// styles
import styles from "./chat-list-screen.styles";

type ChatListScreenProps = {
    navigation: StackNavigationProp<StackNavigatorParams, "ChatListScreen">;
};

const ChatListScreen: FC<ChatListScreenProps> = () => {
    return <View style={styles.container}></View>;
};

export default ChatListScreen;
