import React, { memo, useCallback } from "react";

// modules
import { Trans } from "@lingui/macro";
import { Platform, Pressable, StyleSheet, View } from "react-native";
import Animated, { useAnimatedStyle, useSharedValue, withTiming } from "react-native-reanimated";

// components
import { CloseButton } from "@components";
import { Text } from "@atoms";

// hooks
import { useTheme } from "@react-navigation/native";

// theme
import { globalSize, globalStyles } from "@theme/theme";

const HEIGHT = Platform.select({ ios: 80, android: 110 });

const EndToEndEncryptedNotifyView = memo(() => {
    const theme = useTheme();

    const heightValue = useSharedValue(HEIGHT);

    const animatedViewStyle = useAnimatedStyle(() => {
        return {
            height: heightValue.value
        };
    }, []);

    const handleCloseOnPress = useCallback(() => {
        heightValue.value = withTiming(0);
    }, []) as () => void;

    return (
        <Animated.View
            style={[styles.container, { backgroundColor: theme.colors.border }, animatedViewStyle]}
        >
            <View style={globalStyles["flex-1"]}>
                <Text style={styles.text1 as any}>
                    <Trans>End-to-end encrypted</Trans>
                </Text>
                <Text style={styles.text2 as any}>
                    <Trans>Messages and others are secured with end-to-end encryption.</Trans>
                </Text>
                <Pressable>
                    <Text style={{ ...styles.text3, color: theme.colors.primary }}>
                        <Trans>Learn more</Trans>
                    </Text>
                </Pressable>
            </View>
            <CloseButton style={styles.button} size={20} onPress={handleCloseOnPress} />
        </Animated.View>
    );
});

const styles = StyleSheet.create({
    container: {
        height: HEIGHT,
        borderRadius: 3,
        paddingHorizontal: 8,
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center",
        overflow: "hidden"
    },
    text1: {
        fontSize: 12,
        fontFamily: "Roboto-Black",
        letterSpacing: 0.3
    },
    text2: {
        fontSize: 12,
        fontFamily: "Roboto-Light",
        letterSpacing: 0.3
    },
    text3: {
        fontSize: 12,
        letterSpacing: 0.3
    },
    button: {
        width: globalSize.box40,
        height: globalSize.box40,
        justifyContent: "center",
        alignItems: "center"
    }
});

export default EndToEndEncryptedNotifyView;
