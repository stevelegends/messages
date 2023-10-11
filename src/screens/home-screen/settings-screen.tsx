// react
import React, { FC } from "react";

// modules
import { View } from "react-native";
import { StackNavigationProp } from "@react-navigation/stack";

// styles
import styles from "./home-screen.styles";

// theme
import { globalStyles } from "@theme/theme";

// components
import { Text } from "@atoms";

// navigation
import { StackNavigatorParams } from "@navigation/main-navigator";

type SettingsScreenProps = {
    navigation: StackNavigationProp<StackNavigatorParams, "SettingsScreen">;
};

const SettingsScreen: FC<SettingsScreenProps> = () => {
    return (
        <View style={[styles.container, globalStyles["flex-center"]]}>
            <Text>Home</Text>
        </View>
    );
};

export default SettingsScreen;
