import React, { FC } from "react";

// modules
import { Pressable, StyleSheet, TextStyle, View, ViewStyle } from "react-native";
import Animated, { useAnimatedStyle, useSharedValue, withTiming } from "react-native-reanimated";

// components
import { Text } from "@components";

// hooks
import { DarkTheme, useTheme } from "@react-navigation/native";
import { globalColor } from "@theme/theme";

type Props = {
    text?: string;
    type?: "system" | "default" | "owner" | "their";
    time?: string;
};

const BubbleView: FC<Props> = props => {
    const theme = useTheme();

    const containerStyle: ViewStyle = {
        justifyContent: "center"
    };

    const bubbleStyle: ViewStyle = {
        ...styles.wrap,
        backgroundColor: theme.dark ? DarkTheme.colors.border : theme.colors.primary,
        borderColor: theme.dark ? DarkTheme.colors.border : theme.colors.primary
    };

    const textStyle: TextStyle = {
        ...styles.text,
        color: theme.dark ? globalColor.white : globalColor.white
    };

    const textTimeStyle: TextStyle = {
        ...styles.textTime,
        color: theme.dark ? globalColor.white : globalColor.white
    };

    switch (props.type) {
        case "system":
            bubbleStyle.backgroundColor = theme.dark ? globalColor.white : globalColor.white;
            bubbleStyle.borderColor = theme.dark ? globalColor.white : globalColor.white;
            bubbleStyle.alignItems = "center";
            textStyle.color = theme.dark ? theme.colors.border : theme.colors.primary;
            break;
        case "owner":
            containerStyle.justifyContent = "flex-end";
            containerStyle.marginLeft = 50;
            containerStyle.marginRight = 10;
            bubbleStyle.alignItems = "flex-end";
            break;
        case "their":
            containerStyle.justifyContent = "flex-start";
            containerStyle.marginRight = 50;
            containerStyle.marginLeft = 10;
            bubbleStyle.alignItems = "flex-end";

            bubbleStyle.backgroundColor = theme.dark ? globalColor.white : globalColor.white;
            bubbleStyle.borderColor = theme.dark ? globalColor.white : globalColor.white;
            textStyle.color = theme.dark ? theme.colors.border : theme.colors.primary;
            textTimeStyle.color = theme.dark ? theme.colors.border : theme.colors.primary;
            break;
    }

    const height = useSharedValue<number>(0);

    const animatedTimeStyle = useAnimatedStyle(() => {
        return {
            height: height.value,
            alignItems: "flex-end",
            justifyContent: "flex-end"
        };
    }, []);

    const handleOnPress = () => {
        height.value = withTiming(height.value === 20 ? 0 : 20);
    };

    return (
        <Pressable style={[styles.container, containerStyle]} onPress={handleOnPress}>
            <View style={bubbleStyle}>
                <Text style={textStyle as any}>{props.text}</Text>
                {props.time && (
                    <Animated.View style={animatedTimeStyle}>
                        <Text numberOfLines={1} style={textTimeStyle as any}>
                            {new Date(props.time).toDateString()} -{" "}
                            {new Date(props.time).toLocaleTimeString()}
                        </Text>
                    </Animated.View>
                )}
            </View>
        </Pressable>
    );
};

const styles = StyleSheet.create({
    container: {
        flexDirection: "row"
    },
    wrap: {
        borderRadius: 6,
        padding: 5,
        marginBottom: 10,
        borderWidth: 1
    },
    text: {
        letterSpacing: 0.3,
        fontSize: 16
    },
    textTime: {
        letterSpacing: 0.3,
        fontSize: 12
    }
});

export default BubbleView;
