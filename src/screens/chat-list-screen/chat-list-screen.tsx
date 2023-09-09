// react
import React, { FC } from "react";

// modules
import { StackNavigationProp } from "@react-navigation/stack";
import { View } from "react-native";

// styles
import styles from "./chat-list-screen.styles";
import { BottomTabStackNavigatorParams } from "@navigation/bottom-tab-navigation";

type ChatListScreenProps = {
    navigation: StackNavigationProp<BottomTabStackNavigatorParams, "ChatListScreen">;
};

const ChatListScreen: FC<ChatListScreenProps> = () => {
    return <View style={styles.container}></View>;
};

export default ChatListScreen;
