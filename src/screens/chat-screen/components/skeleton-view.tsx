import React, { FC, ReactNode, useEffect, useState } from "react";

// modules
import Animated, {
    Easing,
    interpolate,
    useAnimatedStyle,
    useSharedValue,
    withRepeat,
    withTiming
} from "react-native-reanimated";
import { Dimensions, StyleSheet, View } from "react-native";

// hooks
import { useTheme } from "@react-navigation/native";

// theme
import { globalColor, globalStyles } from "@theme/theme";

const WIDTH = Dimensions.get("screen").width / 2;
const HEIGHT = Dimensions.get("screen").height;
const ITEM_HEIGHT = 80;

type Props = {
    children: ReactNode;
};

const SkeletonView: FC<Props> = ({ children }) => {
    const [isLoading, setIsLoading] = useState(true);

    const theme = useTheme();

    const animatedX = useSharedValue(0);
    const animatedStyle = useAnimatedStyle(() => {
        return {
            width: 25,
            height: ITEM_HEIGHT,
            backgroundColor: theme.dark ? theme.colors.border : globalColor.white,
            opacity: interpolate(animatedX.value, [0, WIDTH / 2, WIDTH], [0.1, 0.5, 0.1]),
            transform: [{ translateX: animatedX.value }]
        };
    }, [theme.dark]);

    useEffect(() => {
        animatedX.value = withRepeat(
            withTiming(WIDTH, { duration: 400, easing: Easing.linear }),
            0,
            false
        );
    }, []);

    useEffect(() => {
        const timer = setTimeout(() => {
            setIsLoading(false);
            clearTimeout(timer);
        }, 400);
    }, []);

    if (!isLoading) {
        return children;
    }

    return (
        <View style={globalStyles["flex-1"]}>
            {Array.from({ length: Math.floor(HEIGHT / ITEM_HEIGHT) }, (_, index) => {
                const isRight = index % 2;
                return (
                    <View
                        key={index.toString()}
                        style={[
                            {
                                alignSelf: isRight ? "flex-start" : "flex-end",
                                width: WIDTH + Math.floor(Math.random() * (20 - 5 + 1) + 5)
                            },
                            styles.wrapItem
                        ]}
                    >
                        <Animated.View
                            style={[
                                StyleSheet.absoluteFill,
                                {
                                    backgroundColor: theme.colors.border,
                                    opacity: 0.4,
                                    justifyContent: "center"
                                }
                            ]}
                        >
                            <Animated.View
                                style={[
                                    {
                                        backgroundColor: globalColor.white,
                                        opacity: theme.dark ? 0.2 : 0.5,
                                        alignSelf: isRight ? "flex-start" : "flex-end"
                                    },
                                    styles.view1
                                ]}
                            />
                            <Animated.View
                                style={[
                                    {
                                        backgroundColor: globalColor.white,
                                        opacity: theme.dark ? 0.2 : 0.5,
                                        alignSelf: isRight ? "flex-start" : "flex-end"
                                    },
                                    styles.view2
                                ]}
                            />
                        </Animated.View>

                        <Animated.View style={[StyleSheet.absoluteFill, animatedStyle]} />
                    </View>
                );
            })}
        </View>
    );
};

const styles = StyleSheet.create({
    wrapItem: {
        height: ITEM_HEIGHT,
        marginTop: 20,
        borderRadius: 5,
        overflow: "hidden"
    },
    view1: {
        height: 20,
        borderRadius: 5,
        marginHorizontal: 8,
        marginBottom: 2,
        width: "80%"
    },
    view2: {
        height: 20,
        borderRadius: 5,
        marginHorizontal: 8,
        marginTop: 4,
        width: "30%"
    }
});

export default SkeletonView;
