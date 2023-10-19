import React, { FC } from "react";

// modules
import { StyleSheet, TextStyle, TouchableOpacity, ViewStyle } from "react-native";
import { Trans } from "@lingui/macro";

// components
import Text from "../atoms/text";

// hooks
import { useTheme } from "@react-navigation/native";

// theme
import { AppSize } from "@theme/theme";

type Props = {
    onPress?: () => void;
    style?: ViewStyle;
    titleStyle?: TextStyle;
};

const NewGroupButtonText: FC<Props> = ({ onPress = () => undefined, style, titleStyle }) => {
    const theme = useTheme();
    return (
        <TouchableOpacity style={[styles.button, style]} onPress={onPress}>
            <Text
                style={{
                    color: theme.colors.primary,
                    fontFamily: "Roboto-Regular",
                    ...styles.title,
                    ...(titleStyle as any)
                }}
            >
                <Trans>New Group</Trans>
            </Text>
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    title: {
        letterSpacing: 0.3
    },
    button: {
        height: AppSize["button-30"],
        alignSelf: "flex-start",
        justifyContent: "center",
        alignItems: "center",
        paddingHorizontal: 8
    }
});

export default NewGroupButtonText;
