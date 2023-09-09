// react
import React, { FC } from "react";

// modules
import { Button, View } from "react-native";
import { StackNavigationProp } from "@react-navigation/stack";
import { StackNavigatorParams } from "@navigation/navigation";

// styles
import styles from "./home-screen.styles";
import { globalStyles } from "@theme/theme";

// components
import { Text } from "@components";
import { useNavigation } from "@hooks/index";

// hooks

type HomeScreenProps = {
    navigation: StackNavigationProp<StackNavigatorParams, "HomeScreen">;
};
const HomeScreen: FC<HomeScreenProps> = () => {
    const { navigate } = useNavigation();
    return (
        <View style={[styles.container, globalStyles["flex-center"]]}>
            <Text>Home</Text>
            <Button
                title="Chat list"
                onPress={() => {
                    navigate("ChatSettingsScreen");
                }}
            />
        </View>
    );
};

export default HomeScreen;
