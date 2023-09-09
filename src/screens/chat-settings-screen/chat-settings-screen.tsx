// react
import React, { FC } from "react";

// modules
import { View } from "react-native";
import { StackNavigationProp } from "@react-navigation/stack";

// navigation
import { BottomTabStackNavigatorParams } from "@navigation/bottom-tab-navigation";

// styles
import styles from "./chat-settings-screen.styles";

type ChatSettingsScreenProps = {
    navigation: StackNavigationProp<BottomTabStackNavigatorParams, "ChatSettingsScreen">;
};

const ChatSettingsScreen: FC<ChatSettingsScreenProps> = () => {
    return <View style={styles.container}></View>;
};

export default ChatSettingsScreen;
