import React, { FC, useCallback } from "react";

// modules
import { Pressable, StyleSheet, TextStyle, View, ViewStyle } from "react-native";
import Animated, { SlideInRight, SlideOutLeft } from "react-native-reanimated";

// component
import { CloseButtonBorder } from "@components";
import { Text } from "@atoms";

// hooks
import { Theme, useTheme } from "@react-navigation/native";

// theme
import { globalColor } from "@theme/theme";

// utils
import { onFormatDateTimeString } from "@utils";
import { MessageType } from "./bubble-view";

type Props = {
    text?: string;
    time?: string;
    user?: any;
    onCancel?: (value: undefined) => void;
    onPress?: () => void;
    type?: "their" | "owner";
};

const ReplyToView: FC<Props> = ({ text, time, user, onCancel, onPress, type = "their" }) => {
    const theme = useTheme();
    const isCancel = typeof onCancel === "function";

    const name = `${user.firstName} ${user.lastName}`;

    const handleCloseOnPress = useCallback(() => {
        isCancel && onCancel(undefined);
    }, []) as () => void;

    return (
        <Pressable>
            <Animated.View
                entering={isCancel ? SlideInRight : undefined}
                exiting={isCancel ? SlideOutLeft : undefined}
                style={containerStyle(isCancel, theme, type)}
            >
                <View style={isCancel ? styles.textContainer : {}}>
                    <Text numberOfLines={1} style={timeStyle(isCancel, theme, type) as any}>
                        {onFormatDateTimeString(time)}
                    </Text>
                    <Text numberOfLines={1} style={nameStyle(isCancel, theme, type) as any}>
                        {name}
                    </Text>
                    <Text numberOfLines={5} style={textStyle(isCancel, theme, type) as any}>
                        {text}
                    </Text>
                </View>
                {isCancel && <CloseButtonBorder onPress={handleCloseOnPress} size={20} />}
            </Animated.View>
        </Pressable>
    );
};

ReplyToView.defaultProps = {
    user: {},
    onPress: () => undefined
};

const containerStyle = (isCancel: boolean, theme: Theme, type: MessageType): ViewStyle => ({
    borderLeftWidth: 4,
    paddingHorizontal: 10,
    borderTopWidth: 0.5,
    borderRightWidth: 0.5,
    borderBottomWidth: 0.5,
    marginHorizontal: 8,
    marginVertical: 8,
    borderRadius: 3,
    flexDirection: "row",
    alignItems: "center",

    paddingVertical: isCancel ? 8 : 0,
    backgroundColor: isCancel
        ? theme.colors.card
        : {
              their: theme.dark ? globalColor["dark-grey"] : globalColor.white,
              owner: theme.colors.primary
          }[type],
    borderColor: isCancel
        ? theme.colors.border
        : {
              their: theme.dark ? globalColor["dark-grey"] : globalColor.white,
              owner: theme.colors.primary
          }[type],
    borderLeftColor: isCancel
        ? theme.colors.primary
        : {
              their: theme.dark ? globalColor.white : theme.colors.primary,
              owner: globalColor.white
          }[type]
});

const timeStyle = (isCancel: boolean, theme: Theme, type: MessageType): TextStyle => ({
    fontSize: isCancel ? 10 : 9,
    letterSpacing: 0.3,
    fontFamily: "Roboto-Regular",
    color: isCancel
        ? theme.colors.text
        : {
              their: theme.dark ? globalColor.white : theme.colors.primary,
              owner: globalColor.white
          }[type]
});

const nameStyle = (isCancel: boolean, theme: Theme, type: MessageType): TextStyle => ({
    letterSpacing: 0.3,
    fontFamily: "Roboto-Medium",
    color: isCancel
        ? theme.colors.primary
        : {
              their: theme.dark ? globalColor.white : theme.colors.primary,
              owner: globalColor.white
          }[type],
    fontSize: isCancel ? 14 : 12
});

const textStyle = (isCancel: boolean, theme: Theme, type: MessageType): TextStyle => ({
    color: isCancel
        ? theme.colors.text
        : {
              their: theme.dark ? globalColor.white : theme.colors.primary,
              owner: globalColor.white
          }[type],
    fontSize: isCancel ? 14 : 12
});

const styles = StyleSheet.create({
    textContainer: {
        flex: 1
    }
});

export default ReplyToView;
