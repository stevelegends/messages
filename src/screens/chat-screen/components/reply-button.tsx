import React, { FC } from "react";

// modules
import { StyleSheet, Text, TouchableOpacity, ViewStyle } from "react-native";
import { FontAwesome } from "@expo/vector-icons";
import { Trans } from "@lingui/macro";

type Props = {
    buttonSize?: number;
    size?: number;
    color?: string;
    backgroundColor?: string;
    onPress: () => void;
    isTitle?: boolean;
    style?: ViewStyle;
};

const ReplyButton: FC<Props> = ({
    buttonSize,
    size,
    color,
    backgroundColor,
    onPress,
    isTitle,
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
                    backgroundColor,
                    borderRadius: buttonSize || 0 / 2
                },
                style
            ]}
        >
            <FontAwesome name="reply" size={size} color={color} />
            {isTitle && (
                <Text lineBreakMode="tail" numberOfLines={1} style={[styles.title, { color }]}>
                    <Trans>Reply</Trans>
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

ReplyButton.defaultProps = {
    onPress: () => undefined,
    size: 24,
    color: "black",
    buttonSize: 30
};

export default ReplyButton;
