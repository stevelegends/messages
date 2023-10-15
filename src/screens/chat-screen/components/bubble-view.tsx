import React, { FC, Fragment, useCallback, useMemo } from "react";

// modules
import { StyleSheet, TextStyle, View, ViewStyle } from "react-native";
import Animated, {
    BounceIn,
    BounceOut,
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
import { AntDesign } from "@expo/vector-icons";

// components
import { OptionButton, ImageAuto } from "@components";
import { Text } from "@atoms";
import CloseButton from "./close-button";
import CopyButton from "./copy-button";
import ReplyButton from "./reply-button";
import StarButton from "./star-button";
import ReplyToView from "./reply-to-view";

// hooks
import { DarkTheme, Theme, useTheme } from "@react-navigation/native";

// theme
import { globalColor, globalSize, globalStyles } from "@theme/theme";

// utils
import { categorizeLinks, onCopyToClipboardAsync, onFormatDateTimeString } from "@utils";
import ImageAttachesView from "./image-attaches-view";

export type MessageType = "owner" | "their";

type Props = {
    id: string;
    index: number;
    text?: string;
    type?: MessageType;
    time?: string;
    images?: Array<string>;
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

    const attaches = useMemo(() => {
        if (props.text) {
            const links = categorizeLinks(props.text);
            return links;
        }
        return {};
    }, [props.text, props.images]) as { imageUrl: string[]; url: string[] };

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
            <Animated.View
                style={[animatedOptionButtonStyle, optionButtonStyle(theme, props.type)]}
            >
                <OptionButton
                    buttonSize={25}
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
            <View style={[StyleSheet.absoluteFill, actionStyle(props.type)]}>
                <Animated.View style={[globalStyles["flex-row"], animatedButtonsStyle]}>
                    {RenderButtons.map((button, index) => (
                        <Fragment key={index.toString()}>{button}</Fragment>
                    ))}
                </Animated.View>
            </View>
            <GestureDetector gesture={panGesture}>
                <Animated.View style={[translateX, { flex: 1 }]}>
                    <View style={containerStyle(props.type)}>
                        {props.type === "owner" && <View style={globalStyles["flex-1"]} />}
                        <View style={bubbleStyle(theme, props.type)}>
                            {props.replying.to && (
                                <ReplyToView
                                    time={props.replying.to.sentAt}
                                    text={props.replying.to?.text}
                                    user={props.replying.user}
                                    type={props.type}
                                />
                            )}
                            {Array.isArray(attaches.imageUrl) && attaches.imageUrl.length > 0 && (
                                <View
                                    style={{
                                        // TODO
                                        flexDirection: "row",
                                        flexWrap: "wrap",
                                        marginHorizontal: 8,
                                        marginBottom: 4
                                    }}
                                >
                                    {attaches.imageUrl.map((url, index) => {
                                        const isFirst = index === 0;
                                        const isLast = index === attaches.imageUrl.length - 1;
                                        const radius = 5;
                                        return (
                                            <View
                                                key={index.toString()}
                                                style={{
                                                    borderTopLeftRadius: isFirst ? radius : 0,
                                                    borderBottomLeftRadius: isFirst ? radius : 0,
                                                    borderTopRightRadius: isLast ? radius : 0,
                                                    borderBottomRightRadius: isLast ? radius : 0,
                                                    overflow: "hidden"
                                                }}
                                            >
                                                <ImageAuto
                                                    resizeMode="center"
                                                    source={{ uri: url }}
                                                />
                                                {/*<Text style={{color: theme.colors.primary}}>*/}
                                                {/*    {url}*/}
                                                {/*</Text>*/}
                                            </View>
                                        );
                                    })}
                                </View>
                            )}
                            <ImageAttachesView attaches={props.images} removeOnPress={() => {}} />

                            <View style={messageStyle(props.type)}>
                                {props.type === "their" && RenderOptionButton}
                                <Text style={textStyle(theme, props.type) as any}>
                                    {props.text}
                                </Text>
                                {props.type === "owner" && RenderOptionButton}
                            </View>
                        </View>
                        {props.type === "their" && <View style={globalStyles["flex-1"]} />}
                    </View>

                    <View style={wrapStatusViewStyle(props.type)}>
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
                            <Text numberOfLines={1} style={styles.textTime}>
                                {onFormatDateTimeString(props.time)}
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
    }
});

const messageStyle = (type?: MessageType): ViewStyle => ({
    flexDirection: "row",
    justifyContent: type === "their" ? "flex-start" : "flex-end",
    marginRight: type === "owner" ? 20 : 10,
    marginLeft: type === "their" ? 20 : 10
});

const actionStyle = (type?: MessageType): ViewStyle => ({
    justifyContent: "center",
    marginHorizontal: 10,
    marginBottom: 22,
    alignItems: type === "their" ? "flex-start" : "flex-end"
});

const containerStyle = (type?: MessageType): ViewStyle => ({
    flexDirection: "row",
    alignItems: "center",
    flex: 1
});

const bubbleStyle = (theme: Theme, type?: MessageType): ViewStyle => ({
    borderRadius: 6,
    paddingVertical: 8,
    borderWidth: 1,
    marginRight: type === "owner" ? 8 : 0,
    marginLeft: type === "their" ? 8 : 0,
    maxWidth: "90%",
    backgroundColor:
        type === "their"
            ? theme.dark
                ? globalColor["dark-grey"]
                : globalColor.white
            : theme.dark
            ? DarkTheme.colors.primary
            : theme.colors.primary,
    borderColor:
        type === "their"
            ? theme.dark
                ? globalColor["dark-grey"]
                : globalColor.white
            : theme.dark
            ? DarkTheme.colors.primary
            : theme.colors.primary
});

const wrapStatusViewStyle = (type?: MessageType): ViewStyle => ({
    alignItems: "center",
    justifyContent: "flex-end",
    marginHorizontal: 10,
    marginVertical: 5,
    flexDirection: type === "their" ? "row-reverse" : "row"
});

const textStyle = (theme: Theme, type?: MessageType): TextStyle => ({
    letterSpacing: 0.3,
    fontSize: 16,
    color:
        type === "their"
            ? theme.dark
                ? globalColor.white
                : theme.colors.primary
            : theme.dark
            ? globalColor.white
            : globalColor.white
});

const optionButtonStyle = (theme: Theme, type?: MessageType): TextStyle => ({
    position: "absolute",
    alignSelf: "center",
    [type === "their" ? "left" : "right"]: -20
});

export default BubbleView;
