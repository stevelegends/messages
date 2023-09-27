import React, { FC, ReactNode } from "react";

// modules
import Animated, { FadeIn, FadeOut, ZoomIn, ZoomOut } from "react-native-reanimated";
import { StyleSheet, View } from "react-native";

// components
import { Text } from "@components";

type Props = {
    icon?: ReactNode;
    message?: ReactNode;
    visible?: boolean;
};

const AnimatedStatusView: FC<Props> = ({ icon, message, visible }) => {
    if (visible) {
        return (
            <View style={styles.view}>
                <Animated.View entering={ZoomIn} exiting={ZoomOut}>
                    {icon}
                </Animated.View>
                <Animated.View entering={FadeIn} exiting={FadeOut}>
                    <Text style={styles.text}>{message}</Text>
                </Animated.View>
            </View>
        );
    }
    return null;
};

const styles = StyleSheet.create({
    view: {
        justifyContent: "center",
        alignItems: "center"
    },
    text: {
        letterSpacing: 0.3
    }
});

export default AnimatedStatusView;
