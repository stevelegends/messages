import React, { FC, memo, useEffect } from "react";

// modules
import { i18n } from "@lingui/core";
import { Dimensions, StyleSheet, TouchableOpacity, View } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { msg } from "@lingui/macro";
import Animated, {
    BounceInLeft,
    runOnJS,
    SlideOutRight,
    useAnimatedStyle,
    useSharedValue,
    withSpring,
    withTiming
} from "react-native-reanimated";
import { Gesture, GestureDetector } from "react-native-gesture-handler";

// components
import Text from "../text";

// contexts
import { useThemeProvider } from "@contexts/theme-context";

export type StatusType = "success" | "error" | "warning" | "info";

const color = (dark: boolean) => ({
    success: {
        primary: "#45CC99",
        background: dark ? "#2F3032" : "#E5FAF6",
        text: dark ? "#FFFFFF" : "#2F3032",
        icon: "#FFFFFF"
    },
    error: {
        primary: "#EB5757",
        background: dark ? "#2F3032" : "#FDEEEE",
        text: dark ? "#FFFFFF" : "#2F3032",
        icon: "#FFFFFF"
    },
    warning: {
        primary: "#F2C84C",
        background: dark ? "#2F3032" : "#FDF8E8",
        text: dark ? "#FFFFFF" : "#2F3032",
        icon: "#FFFFFF"
    },
    info: {
        primary: "#5458F7",
        background: dark ? "#2F3032" : "#EEEEFE",
        text: dark ? "#FFFFFF" : "#2F3032",
        icon: "#FFFFFF"
    }
});

const title = {
    success: msg`Success`,
    error: msg`Error`,
    warning: msg`Warning`,
    info: msg`Info`
};

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
    timeout?: number;
};

const CLAMP = 20;
const WIDTH = Dimensions.get("window").width;

const PopupView: FC<Props> = memo(({ id, index, onPress, status, title, message, timeout }) => {
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

    useEffect(() => {
        if (timeout && index >= 0) {
            const time = setTimeout(
                () => {
                    handleOnPress();
                },
                timeout * (index + 1)
            );
            return () => {
                clearTimeout(time);
            };
        }
    }, [timeout, index]);

    return (
        <GestureDetector gesture={panGesture}>
            <Animated.View
                entering={BounceInLeft}
                exiting={SlideOutRight}
                style={[
                    translateX,
                    styles.container,
                    {
                        borderWidth: 1,
                        borderColor: getColor.primary,
                        backgroundColor: getColor.background,
                        zIndex: index,
                        marginTop: 50 + index * 3
                    }
                ]}
            >
                {/*<View style={[styles.horizontalStatus, {backgroundColor: getColor.primary}]} />*/}
                <TouchableOpacity
                    onPress={handleOnPress}
                    style={[styles.statusView, { backgroundColor: getColor.primary }]}
                >
                    <Icon status={status} color={getColor.icon} size={25} />
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
        width: 45,
        height: 45,
        borderRadius: 45 / 2,
        justifyContent: "center",
        alignItems: "center",
        marginVertical: 20,
        marginHorizontal: 20
    },
    wrapMessage: {
        flex: 1
    },
    messageText: {
        fontSize: 14
    },
    horizontalStatus: {
        width: 3,
        height: "100%",
        borderRadius: 1.5
    }
});

export default PopupView;
