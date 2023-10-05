import React, { FC } from "react";

// modules
import { StyleSheet, Text, TouchableOpacity, ViewStyle } from "react-native";
import { AntDesign } from "@expo/vector-icons";
import { Trans } from "@lingui/macro";

type Props = {
    buttonSize?: number;
    size?: number;
    color?: string;
    backgroundColor?: string;
    onPress?: () => void;
    isTitle?: boolean;
    style?: ViewStyle;
    fill?: boolean;
    disabled?: boolean;
};

const StarButton: FC<Props> = ({
    buttonSize,
    size,
    color,
    backgroundColor,
    onPress,
    isTitle,
    style,
    fill,
    disabled
}) => {
    return (
        <TouchableOpacity
            disabled={disabled}
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
            <AntDesign name={fill ? "star" : "staro"} size={size} color={color} />
            {isTitle && (
                <Text lineBreakMode="tail" numberOfLines={1} style={[styles.title, { color }]}>
                    <Trans>Star</Trans>
                </Text>
            )}
        </TouchableOpacity>
    );
};

StarButton.defaultProps = {
    onPress: () => undefined
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

StarButton.defaultProps = {
    onPress: () => undefined,
    size: 24,
    color: "black",
    buttonSize: 30
};

export default StarButton;
