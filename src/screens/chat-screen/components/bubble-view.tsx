import React, { FC } from "react";

// modules
import { StyleSheet, TextStyle, View, ViewStyle } from "react-native";

// components
import { Text } from "@components";

// hooks
import { DarkTheme, useTheme } from "@react-navigation/native";
import { globalColor } from "@theme/theme";

type Props = {
    text?: string;
    type?: "system" | "default";
};

const BubbleView: FC<Props> = props => {
    const theme = useTheme();

    const bubbleStyle: ViewStyle = {
        ...styles.wrap,
        backgroundColor: theme.dark ? DarkTheme.colors.border : theme.colors.primary,
        borderColor: theme.dark ? DarkTheme.colors.border : theme.colors.primary
    };

    const textStyle: TextStyle = {
        ...styles.text,
        color: theme.dark ? globalColor.white : globalColor.white
    };

    switch (props.type) {
        case "system":
            bubbleStyle.backgroundColor = theme.dark ? globalColor.white : globalColor.white;
            bubbleStyle.borderColor = theme.dark ? globalColor.white : globalColor.white;
            bubbleStyle.marginTop = 10;
            bubbleStyle.alignItems = "center";
            textStyle.color = theme.dark ? theme.colors.border : theme.colors.primary;
            break;
    }

    return (
        <View style={styles.container}>
            <View style={bubbleStyle}>
                <Text style={textStyle as any}>{props.text}</Text>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flexDirection: "row",
        justifyContent: "center"
    },
    wrap: {
        borderRadius: 6,
        padding: 5,
        marginBottom: 10,
        borderWidth: 1
    },
    text: {
        letterSpacing: 0.3
    }
});

export default BubbleView;
