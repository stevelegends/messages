import React, { FC } from "react";

// modules
import { StyleSheet, Text, TouchableOpacity, ViewStyle } from "react-native";
import { AntDesign } from "@expo/vector-icons";

type Props = {
    buttonSize?: number;
    size?: number;
    color?: string;
    backgroundColor?: string;
    onPress: () => void;
    isTitle?: boolean;
    style?: ViewStyle;
};

const CloseButton: FC<Props> = ({
    buttonSize,
    size,
    color,
    onPress,
    isTitle,
    backgroundColor,
    style
}) => {
    return (
        <TouchableOpacity
            onPress={onPress}
            style={[
                styles.button,
                {
                    width: buttonSize,
                    height: buttonSize,
                    borderRadius: buttonSize || 0 / 2,
                    backgroundColor
                },
                style
            ]}
        >
            <AntDesign name="close" size={size} color={color} />
            {isTitle && (
                <Text lineBreakMode="tail" numberOfLines={1} style={[styles.title, { color }]}>
                    Close
                </Text>
            )}
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    button: {
        justifyContent: "center",
        alignItems: "center"
    },
    title: {
        fontSize: 10,
        fontFamily: "Roboto-Medium"
    }
});

CloseButton.defaultProps = {
    onPress: () => undefined,
    size: 24,
    color: "black",
    buttonSize: 30
};

export default CloseButton;
