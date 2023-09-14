// react
import React, { FC } from "react";

// modules
import { Pressable } from "react-native";
import { Feather } from "@expo/vector-icons";
import Animated, { FlipInEasyY, FlipOutEasyY } from "react-native-reanimated";

// hooks
import { useTheme } from "@react-navigation/native";

type ToggleEyeButtonProps = {
    isOff: boolean;
    onPress: (isOff: boolean) => void;
};

const ToggleEyeButton: FC<ToggleEyeButtonProps> = ({ isOff, onPress }) => {
    const theme = useTheme();
    const handleOnPress = () => {
        onPress(!isOff);
    };
    return (
        <Pressable onPress={handleOnPress}>
            {isOff && (
                <Animated.View entering={FlipInEasyY} exiting={FlipOutEasyY}>
                    <Feather name="eye-off" size={20} color={theme.colors.text} />
                </Animated.View>
            )}
            {!isOff && (
                <Animated.View entering={FlipInEasyY} exiting={FlipOutEasyY}>
                    <Feather name="eye" size={20} color={theme.colors.text} />
                </Animated.View>
            )}
        </Pressable>
    );
};

export default ToggleEyeButton;
