// react
import React, { FC } from "react";

// modules
import { View } from "react-native";
import { StackNavigationProp } from "@react-navigation/stack";
import { BottomTabStackNavigatorParams } from "@navigation/bottom-tab-navigation";

// styles
import styles from "./chat-screen.styles";

type ChatScreenProps = {
    navigation: StackNavigationProp<BottomTabStackNavigatorParams, "ChatListScreen">;
};

const ChatScreen: FC<ChatScreenProps> = () => {
    return <View style={styles.container}></View>;
};

export default ChatScreen;
