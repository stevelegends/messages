import React, { FC, memo } from "react";

// modules
import { Dimensions, StyleSheet, TouchableOpacity, View } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import Animated, {
    runOnJS,
    SlideInLeft,
    SlideOutRight,
    useAnimatedStyle,
    useSharedValue,
    withSpring,
    withTiming,
    ZoomIn,
    ZoomOut
} from "react-native-reanimated";
import { Gesture, GestureDetector } from "react-native-gesture-handler";

// components
import Text from "../text";

// contexts
import { useThemeProvider } from "@contexts/theme-context";
import { globalColor } from "@theme/theme";

export type StatusType = "success" | "error" | "warning" | "info";

const color = (dark: boolean) => ({
    success: {
        primary: globalColor["green-active"],
        background: dark ? globalColor["black-2"] : globalColor["white-2"],
        text: dark ? globalColor["white-1.0"] : globalColor["black-2"],
        icon: globalColor["white-1.0"]
    },
    error: {
        primary: globalColor["red-error"],
        background: dark ? globalColor["black-2"] : globalColor["light-grey-1"],
        text: dark ? globalColor["white-1.0"] : globalColor["black-2"],
        icon: globalColor["white-1.0"]
    },
    warning: {
        primary: globalColor["yellow-warn"],
        background: dark ? globalColor["black-2"] : globalColor.white3,
        text: dark ? globalColor["white-1.0"] : globalColor["black-2"],
        icon: globalColor["white-1.0"]
    },
    info: {
        primary: globalColor["blue-info"],
        background: dark ? globalColor["black-2"] : globalColor["white-3e"],
        text: dark ? globalColor["white-1.0"] : globalColor["black-2"],
        icon: globalColor["white-1.0"]
    }
});

const Icon = ({
    status,
    color,
    size = 20
}: {
    status: StatusType;
    color: string;
    size: number;
}) => {
    if (status === "success") {
        return <MaterialIcons name="check" size={size} color={color} />;
    }
    if (status === "error") {
        return <MaterialIcons name="close" size={size} color={color} />;
    }
    if (status === "warning") {
        return <MaterialIcons name="error-outline" size={size} color={color} />;
    }
    if (status === "info") {
        return <MaterialIcons name="info-outline" size={size} color={color} />;
    }
};

type Props = {
    id: string;
    index: number;
    onPress: (id: string) => void;
    status: StatusType;
    title: string;
    message: string;
};

const CLAMP = 20;
const WIDTH = Dimensions.get("window").width;

const PopupView: FC<Props> = memo(({ id, index, onPress, status, title, message }) => {
    const theme = useThemeProvider();
    const getColor = color(theme.isDark)[status];

    const offsetX = useSharedValue(0);

    const handleOnPress = () => {
        onPress && onPress(id);
    };

    const panGesture = Gesture.Pan()
        .onChange(event => {
            const offsetDelta = event.changeX + offsetX.value;
            const clamp = Math.max(-CLAMP, offsetDelta);
            offsetX.value = offsetDelta > 0 ? offsetDelta : withSpring(clamp);
        })
        .onFinalize(() => {
            if (offsetX.value < WIDTH / 3) {
                offsetX.value = withSpring(0);
            } else {
                offsetX.value = withTiming(WIDTH, {}, () => {
                    runOnJS(handleOnPress)();
                });
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

    return (
        <GestureDetector gesture={panGesture}>
            <Animated.View
                entering={SlideInLeft}
                exiting={SlideOutRight}
                style={[
                    translateX,
                    styles.container,
                    {
                        borderWidth: 1,
                        borderColor: getColor.primary,
                        backgroundColor: getColor.background,
                        zIndex: index,
                        // marginTop: 50
                        marginTop: 50 + index * 4
                    }
                ]}
            >
                <TouchableOpacity
                    onPress={handleOnPress}
                    style={[styles.statusView, { backgroundColor: getColor.primary }]}
                >
                    <Icon status={status} color={getColor.icon} size={20} />
                </TouchableOpacity>
                <View style={styles.wrapMessage}>
                    <Text
                        style={{
                            ...styles.messageText,
                            color: getColor.text,
                            fontFamily: "Roboto-Medium"
                        }}
                    >
                        {title}
                    </Text>
                    <Text
                        style={{
                            ...styles.messageText,
                            color: getColor.text,
                            fontFamily: "Roboto-Regular"
                        }}
                    >
                        {message}
                    </Text>
                </View>
                {index > 0 && (
                    <Animated.View
                        entering={ZoomIn.delay(500)}
                        exiting={ZoomOut}
                        style={[styles.counterView]}
                    >
                        <Text
                            style={{
                                ...styles.messageText,
                                color: getColor.text,
                                fontFamily: "Roboto-Medium"
                            }}
                        >
                            {index}
                        </Text>
                    </Animated.View>
                )}
            </Animated.View>
        </GestureDetector>
    );
});

const styles = StyleSheet.create({
    container: {
        position: "absolute",
        flex: 1,
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center",
        marginHorizontal: 10,
        paddingVertical: 10,
        borderRadius: 5,

        shadowColor: "rgba( 1, 1, 1, 0.5)",
        shadowOffset: {
            width: 0,
            height: 1
        },
        shadowOpacity: 0.2,
        shadowRadius: 1.41,

        elevation: 2
    },
    statusView: {
        width: 30,
        height: 30,
        borderRadius: 15,
        justifyContent: "center",
        alignItems: "center",
        marginVertical: 10,
        marginHorizontal: 10
    },
    wrapMessage: {
        flex: 1
    },
    messageText: {
        fontSize: 14
    },
    counterView: {
        justifyContent: "center",
        alignItems: "center",
        marginHorizontal: 10
    }
});

export default PopupView;
