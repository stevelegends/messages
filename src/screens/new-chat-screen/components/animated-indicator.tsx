import React, { FC } from "react";

// modules
import { ActivityIndicator } from "react-native";
import Animated, { ZoomIn, ZoomOut } from "react-native-reanimated";

// hooks
import { useTheme } from "@react-navigation/native";

type Props = {
    visible?: boolean;
};

const AnimatedIndicator: FC<Props> = ({ visible }) => {
    const theme = useTheme();

    if (visible) {
        return (
            <Animated.View entering={ZoomIn} exiting={ZoomOut}>
                <ActivityIndicator size="large" color={theme.colors.text} />
            </Animated.View>
        );
    }
    return null;
};

export default AnimatedIndicator;
