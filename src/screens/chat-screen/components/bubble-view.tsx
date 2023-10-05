import React, { FC, Fragment, useCallback, useMemo } from "react";

// modules
import { Pressable, StyleSheet, TextStyle, View, ViewStyle } from "react-native";
import Animated, {
    BounceIn,
    BounceOut,
    interpolate,
    runOnJS,
    SharedValue,
    useAnimatedReaction,
    useAnimatedStyle,
    useSharedValue,
    withDecay,
    withSpring,
    withTiming
} from "react-native-reanimated";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import { AntDesign } from "@expo/vector-icons";

// components
import { Text, OptionButton } from "@components";
import CloseButton from "./close-button";
import CopyButton from "./copy-button";
import ReplyButton from "./reply-button";
import StarButton from "./star-button";

// hooks
import { DarkTheme, useTheme } from "@react-navigation/native";

// theme
import { globalColor, globalSize, globalStyles } from "@theme/theme";

// utils
import { onCopyToClipboardAsync } from "@utils";
import ReplyToView from "./reply-to-view";

type Props = {
    id: string;
    index: number;
    text?: string;
    type?: "owner" | "their";
    time?: string;
    animatedScrollY?: SharedValue<number>;
    startActionOnPress?: (id: string) => void;
    replyActionOnPress?: (id: string, text?: string) => void;
    isStarred?: boolean;
    replying: {
        to: any;
        user: any;
    };
};

const CLAMP = 20;
const BUTTON_SIZE = 35;
const CALC_WIDTH = (size: number) => BUTTON_SIZE * size + globalSize["space-8"] * size;
const ACTIVE_OFFSET_X = [-10, 10];

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
    const wrapStatusViewStyle: TextStyle = {
        ...styles.wrapStatusView
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

            wrapStatusViewStyle.flexDirection = "row-reverse";
            break;
    }

    const handleCloseOptionButtonOnPress = useCallback(() => {
        offsetX.value = withTiming(0);
    }, []) as () => void;

    const handleCopyOptionButtonOnPress = useCallback(() => {
        handleCloseOptionButtonOnPress();
        onCopyToClipboardAsync(props.text);
    }, []) as () => void;

    const handleReplyOptionButtonOnPress = useCallback(() => {
        handleCloseOptionButtonOnPress();
        props.replyActionOnPress && props.replyActionOnPress(props.id, props.text);
    }, []) as () => void;

    const handleStarOptionButtonOnPress = useCallback(() => {
        handleCloseOptionButtonOnPress();
        props.startActionOnPress && props.startActionOnPress(props.id);
    }, []) as () => void;

    const RenderButtons = useMemo(() => {
        const buttons = [
            <CloseButton
                color={theme.colors.notification}
                backgroundColor={theme.colors.card}
                buttonSize={BUTTON_SIZE}
                size={15}
                onPress={handleCloseOptionButtonOnPress}
            />,
            <View style={{ width: globalSize["space-8"] }} />,
            <ReplyButton
                color={theme.colors.primary}
                backgroundColor={theme.colors.card}
                buttonSize={BUTTON_SIZE}
                size={15}
                onPress={handleReplyOptionButtonOnPress}
            />,
            <View style={{ width: globalSize["space-8"] }} />,
            <CopyButton
                color={theme.colors.primary}
                backgroundColor={theme.colors.card}
                buttonSize={BUTTON_SIZE}
                size={15}
                onPress={handleCopyOptionButtonOnPress}
            />,
            <View style={{ width: globalSize["space-8"] }} />,
            <StarButton
                color={props.isStarred ? globalColor["yellow-warn"] : theme.colors.primary}
                backgroundColor={theme.colors.card}
                buttonSize={BUTTON_SIZE}
                size={15}
                onPress={handleStarOptionButtonOnPress}
                fill={props.isStarred}
            />
        ];
        return props.type === "their" ? buttons : buttons.reverse();
    }, [theme.dark, props.isStarred]);

    const WIDTH = useMemo(
        () => CALC_WIDTH(RenderButtons.length - Math.floor(RenderButtons.length / 2)),
        [RenderButtons.length]
    );

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
        .onFinalize(event => {
            // offsetX.value = withDecay({
            //     velocity: event.velocityX,
            // })
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
        })
        .activeOffsetX(ACTIVE_OFFSET_X);

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
    }, [WIDTH]);

    const animatedOptionButtonStyle = useAnimatedStyle(() => {
        return {
            opacity: interpolate(
                offsetX.value,
                [0, props.type === "owner" ? -WIDTH : WIDTH],
                [1, 0]
            )
        };
    }, [WIDTH]);

    const handleOnPress = () => {};

    const handleOpenOptionViewOnPress = useCallback(() => {
        if (props.type === "owner") {
            offsetX.value = withSpring(-WIDTH);
        }
        if (props.type === "their") {
            offsetX.value = withSpring(WIDTH);
        }
    }, [WIDTH]) as () => void;

    useAnimatedReaction(
        () => props.animatedScrollY,
        (prepareResult, preparePreviousResult) => {
            if (prepareResult && preparePreviousResult) {
                if (offsetX.value !== 0) {
                    runOnJS(handleCloseOptionButtonOnPress)();
                }
            }
        },
        []
    );

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

    console.log(props.replying);

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
                                {props.replying.to && (
                                    <ReplyToView
                                        text={props.replying.to?.text}
                                        user={props.replying.user}
                                    />
                                )}

                                <View style={globalStyles["flex-row"]}>
                                    {props.type === "their" && RenderOptionButton}
                                    <Text style={textStyle as any}>{props.text}</Text>
                                    {props.type === "owner" && RenderOptionButton}
                                </View>
                            </View>
                        </Pressable>
                    </View>

                    <View style={wrapStatusViewStyle}>
                        {props.isStarred && (
                            <Animated.View entering={BounceIn} exiting={BounceOut}>
                                <AntDesign
                                    name="star"
                                    size={10}
                                    color={globalColor["yellow-warn"]}
                                    style={globalStyles["marginH-5"]}
                                />
                            </Animated.View>
                        )}
                        {props.time && (
                            <Text numberOfLines={1} style={textTimeStyle as any}>
                                {new Date(props.time).toLocaleTimeString()}
                            </Text>
                        )}
                    </View>
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
        borderWidth: 1
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
    wrapStatusView: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "flex-end",
        marginHorizontal: 10,
        marginVertical: 5
    }
});

export default BubbleView;
