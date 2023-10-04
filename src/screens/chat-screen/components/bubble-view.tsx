import React, { FC, Fragment, useCallback, useMemo } from "react";

// modules
import { Pressable, StyleSheet, TextStyle, View, ViewStyle } from "react-native";
import Animated, {
    interpolate,
    runOnJS,
    SharedValue,
    useAnimatedReaction,
    useAnimatedStyle,
    useSharedValue,
    withSpring,
    withTiming
} from "react-native-reanimated";
import { Gesture, GestureDetector } from "react-native-gesture-handler";

// components
import { Text, OptionButton } from "@components";
import CloseButton from "./close-button";
import CopyButton from "./copy-button";
import ReplyButton from "./reply-button";

// hooks
import { DarkTheme, useTheme } from "@react-navigation/native";

// theme
import { globalColor, globalSize, globalStyles } from "@theme/theme";

// utils
import { onCopyToClipboardAsync } from "@utils";

type Props = {
    index: number;
    text?: string;
    type?: "owner" | "their";
    time?: string;
    animatedScrollY?: SharedValue<number>;
};

const CLAMP = 20;
const BUTTON_SIZE = 35;
const WIDTH = BUTTON_SIZE * 3 + globalSize["space-8"] * 3;

const BubbleView: FC<Props> = props => {
    const theme = useTheme();

    const actionStyle: ViewStyle = {
        alignItems: "flex-start",
        justifyContent: "center",
        marginHorizontal: 10,
        marginBottom: 22
    };

    const containerStyle: ViewStyle = {
        ...styles.container
    };

    const buttonStyle: ViewStyle = {
        justifyContent: "center"
    };

    const bubbleStyle: ViewStyle = {
        ...styles.wrap,
        backgroundColor: theme.dark ? DarkTheme.colors.primary : theme.colors.primary,
        borderColor: theme.dark ? DarkTheme.colors.primary : theme.colors.primary
    };

    const textStyle: TextStyle = {
        ...styles.text,
        color: theme.dark ? globalColor.white : globalColor.white
    };

    const textTimeStyle: TextStyle = {
        ...styles.textTime
    };
    const wrapTextTimeStyle: TextStyle = {
        ...styles.wrapTextTime
    };

    switch (props.type) {
        case "owner":
            containerStyle.justifyContent = "flex-end";
            containerStyle.marginLeft = 50;
            containerStyle.marginRight = 10;

            bubbleStyle.alignItems = "flex-end";
            bubbleStyle.paddingLeft = 10;

            actionStyle.alignItems = "flex-end";
            break;
        case "their":
            containerStyle.justifyContent = "flex-start";
            containerStyle.marginRight = 50;
            containerStyle.marginLeft = 10;

            bubbleStyle.alignItems = "flex-end";
            bubbleStyle.backgroundColor = theme.dark ? globalColor["dark-grey"] : globalColor.white;
            bubbleStyle.borderColor = theme.dark ? globalColor["dark-grey"] : globalColor.white;
            bubbleStyle.paddingRight = 10;

            textStyle.color = theme.dark ? globalColor.white : theme.colors.primary;

            wrapTextTimeStyle.alignItems = "flex-start";
            wrapTextTimeStyle.justifyContent = "flex-start";
            break;
    }

    const offsetX = useSharedValue(0);

    const panGesture = Gesture.Pan()
        .onChange(event => {
            if (props.type === "owner") {
                const offsetDelta = event.changeX + offsetX.value;
                const clamp = Math.max(-CLAMP, offsetDelta);
                offsetX.value = offsetDelta < 0 ? offsetDelta : withSpring(clamp);
            }
            if (props.type === "their") {
                const offsetDelta = event.changeX + offsetX.value;
                const clamp = Math.max(-CLAMP, offsetDelta);
                offsetX.value = offsetDelta > 0 ? offsetDelta : withSpring(clamp);
            }
        })
        .onFinalize(() => {
            if (props.type === "owner") {
                if (offsetX.value <= -WIDTH / 3) {
                    offsetX.value = withSpring(-WIDTH);
                } else {
                    offsetX.value = withSpring(0);
                }
            }
            if (props.type === "their") {
                if (offsetX.value >= WIDTH / 3) {
                    offsetX.value = withSpring(WIDTH);
                } else {
                    offsetX.value = withSpring(0);
                }
            }
        });

    const translateX = useAnimatedStyle(() => {
        return {
            transform: [
                {
                    translateX: offsetX.value
                }
            ]
        };
    }, []);

    const animatedButtonsStyle = useAnimatedStyle(() => {
        return {
            opacity: interpolate(
                offsetX.value,
                [0, props.type === "owner" ? -WIDTH : WIDTH],
                [0, 1]
            )
        };
    }, []);

    const animatedOptionButtonStyle = useAnimatedStyle(() => {
        return {
            opacity: interpolate(
                offsetX.value,
                [0, props.type === "owner" ? -WIDTH : WIDTH],
                [1, 0]
            )
        };
    }, []);

    const handleOnPress = () => {};

    const handleOpenOptionViewOnPress = useCallback(() => {
        if (props.type === "owner") {
            offsetX.value = withSpring(-WIDTH);
        }
        if (props.type === "their") {
            offsetX.value = withSpring(WIDTH);
        }
    }, []) as () => void;

    const handleCloseOptionViewOnPress = useCallback(() => {
        offsetX.value = withTiming(0);
    }, []) as () => void;

    const handleCopyOptionViewOnPress = useCallback(() => {
        handleCloseOptionViewOnPress();
        onCopyToClipboardAsync(props.text);
    }, []) as () => void;

    const handleReplyOptionViewOnPress = useCallback(() => {
        handleCloseOptionViewOnPress();
    }, []) as () => void;

    useAnimatedReaction(
        () => props.animatedScrollY,
        (prepareResult, preparePreviousResult) => {
            if (prepareResult && preparePreviousResult) {
                if (offsetX.value !== 0) {
                    runOnJS(handleCloseOptionViewOnPress)();
                }
            }
        },
        []
    );

    const RenderButtons = useMemo(() => {
        const buttons = [
            <CloseButton
                color={theme.colors.notification}
                backgroundColor={theme.colors.card}
                buttonSize={BUTTON_SIZE}
                size={15}
                onPress={handleCloseOptionViewOnPress}
            />,
            <View style={{ width: globalSize["space-8"] }} />,
            <ReplyButton
                color={theme.colors.primary}
                backgroundColor={theme.colors.card}
                buttonSize={BUTTON_SIZE}
                size={15}
                onPress={handleReplyOptionViewOnPress}
            />,
            <View style={{ width: globalSize["space-8"] }} />,
            <CopyButton
                color={theme.colors.primary}
                backgroundColor={theme.colors.card}
                buttonSize={BUTTON_SIZE}
                size={15}
                onPress={handleCopyOptionViewOnPress}
            />
        ];
        return props.type === "their" ? buttons : buttons.reverse();
    }, [theme.dark]);

    const RenderOptionButton = useMemo(() => {
        return (
            <Animated.View style={[animatedOptionButtonStyle, globalStyles["align-self-center"]]}>
                <OptionButton
                    buttonSize={20}
                    size={12}
                    onPress={handleOpenOptionViewOnPress}
                    color={
                        theme.dark
                            ? theme.colors.text
                            : props.type === "their"
                            ? theme.colors.primary
                            : theme.colors.background
                    }
                />
            </Animated.View>
        );
    }, [theme.dark]);

    return (
        <Fragment>
            {/*{props.time && <Text style={styles.sessionTime}>{new Date(props.time).toDateString()}</Text>}*/}
            <View style={[StyleSheet.absoluteFill, actionStyle]}>
                <Animated.View style={[globalStyles["flex-row"], animatedButtonsStyle]}>
                    {RenderButtons.map((button, index) => (
                        <Fragment key={index.toString()}>{button}</Fragment>
                    ))}
                </Animated.View>
            </View>
            <GestureDetector gesture={panGesture}>
                <Animated.View style={[translateX]}>
                    <View style={containerStyle}>
                        <Pressable style={[styles.button, buttonStyle]} onPress={handleOnPress}>
                            <View style={bubbleStyle}>
                                {props.type === "their" && RenderOptionButton}
                                <Text style={textStyle as any}>{props.text}</Text>
                                {props.type === "owner" && RenderOptionButton}
                            </View>
                        </Pressable>
                    </View>

                    {props.time && (
                        <Animated.View style={wrapTextTimeStyle}>
                            <Text numberOfLines={1} style={textTimeStyle as any}>
                                {new Date(props.time).toLocaleTimeString()}
                            </Text>
                        </Animated.View>
                    )}
                </Animated.View>
            </GestureDetector>
        </Fragment>
    );
};

const styles = StyleSheet.create({
    container: {
        flexDirection: "row",
        justifyContent: "flex-end",
        alignItems: "center"
    },
    button: {
        flexDirection: "row"
    },
    wrap: {
        borderRadius: 6,
        paddingVertical: 8,
        borderWidth: 1,
        flexDirection: "row"
    },
    text: {
        letterSpacing: 0.3,
        fontSize: 16
    },
    textTime: {
        letterSpacing: 0.3,
        fontSize: 10
    },
    sessionTime: {
        letterSpacing: 0.3,
        fontSize: 14,
        textAlign: "center",
        marginVertical: 10
    },
    wrapTextTime: {
        alignItems: "flex-end",
        justifyContent: "flex-end",
        marginHorizontal: 10,
        marginVertical: 5
    }
});

export default BubbleView;
