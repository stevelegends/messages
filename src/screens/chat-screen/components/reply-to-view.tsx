import React, { FC, useCallback } from "react";

// modules
import { StyleSheet, View } from "react-native";
import Animated, { SlideInRight, SlideOutLeft } from "react-native-reanimated";

// component
import { CloseButtonBorder, Text } from "@components";

// hooks
import { DarkTheme, useTheme } from "@react-navigation/native";
import { globalColor } from "@theme/theme";

type Props = {
    text?: string;
    user?: any;
    onCancel?: any;
};

const ReplyToView: FC<Props> = ({ text, user, onCancel }) => {
    const theme = useTheme();
    const isCancel = typeof onCancel === "function";

    const name = `${user.firstName} ${user.lastName}`;

    const handleCloseOnPress = useCallback(() => {
        isCancel && onCancel();
    }, []) as () => void;

    return (
        <Animated.View
            entering={SlideInRight}
            exiting={SlideOutLeft}
            style={[
                styles.container,
                {
                    backgroundColor: isCancel ? theme.colors.card : theme.colors.primary,
                    borderColor: isCancel ? theme.colors.border : theme.colors.primary,
                    borderLeftColor: isCancel ? theme.colors.primary : globalColor.white
                }
            ]}
        >
            <View style={isCancel ? styles.textContainer : {}}>
                <Text
                    numberOfLines={1}
                    style={{
                        ...styles.name,
                        fontFamily: "Roboto-Medium",
                        color: isCancel ? theme.colors.primary : globalColor.white
                    }}
                >
                    {name}
                </Text>
                <Text
                    numberOfLines={1}
                    style={{
                        color: isCancel ? theme.colors.text : globalColor.white
                    }}
                >
                    {text}
                </Text>
            </View>
            {isCancel && <CloseButtonBorder onPress={handleCloseOnPress} size={20} />}
        </Animated.View>
    );
};

ReplyToView.defaultProps = {
    user: {}
};

const styles = StyleSheet.create({
    container: {
        borderLeftWidth: 4,
        paddingHorizontal: 10,
        paddingVertical: 8,
        borderTopWidth: 0.5,
        borderRightWidth: 0.5,
        borderBottomWidth: 0.5,
        marginHorizontal: 8,
        marginVertical: 8,
        borderRadius: 3,
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center"
    },
    textContainer: {
        flex: 1
    },
    name: {
        letterSpacing: 0.3
    }
});

export default ReplyToView;
