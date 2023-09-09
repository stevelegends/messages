// react
import React, { FC } from "react";

// modules
import { StackNavigationProp } from "@react-navigation/stack";
import { StackNavigatorParams } from "@navigation/navigation";
import { View } from "react-native";

// styles
import styles from "./chat-settings-screen.styles";

type ChatSettingsScreenProps = {
    navigation: StackNavigationProp<StackNavigatorParams, "ChatSettingsScreen">;
};

const ChatSettingsScreen: FC<ChatSettingsScreenProps> = () => {
    return <View style={styles.container}></View>;
};

export default ChatSettingsScreen;
