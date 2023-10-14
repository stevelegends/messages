import React, { FC, memo, useCallback, useEffect, useState } from "react";

// modules
import Animated, { ZoomIn, ZoomOut } from "react-native-reanimated";

// components
import CheckboxIcon from "../atoms/checkbox-icon";

// hooks
import { useTheme } from "@react-navigation/native";
import { StyleSheet, TouchableOpacity, ViewStyle } from "react-native";

type Props = {
    id?: string;
    isChecked?: boolean;
    onPress?: (isChecked: boolean, id?: string) => void;
    style?: ViewStyle;
};

const AnimatedCheckboxButton: FC<Props> = memo(
    ({ isChecked = false, onPress = () => undefined, style, id }) => {
        const theme = useTheme();

        const handleOnPress = useCallback(() => {
            onPress(!isChecked, id);
        }, [id]);

        return (
            <TouchableOpacity
                activeOpacity={1}
                style={[styles.button, style]}
                onPress={handleOnPress}
            >
                {isChecked && (
                    <Animated.View entering={ZoomIn} exiting={ZoomOut}>
                        <CheckboxIcon size={25} color={theme.colors.primary} checked={false} />
                    </Animated.View>
                )}
                {!isChecked && (
                    <Animated.View
                        entering={ZoomIn}
                        exiting={ZoomOut}
                        style={[
                            styles.checkbox,
                            {
                                borderColor: theme.colors.primary
                            }
                        ]}
                    >
                        {/*<CheckboxIcon size={25} color={theme.colors.primary} checked={false} />*/}
                    </Animated.View>
                )}
            </TouchableOpacity>
        );
    }
);

const styles = StyleSheet.create({
    button: {
        justifyContent: "center",
        alignItems: "center"
    },
    checkbox: {
        width: 20,
        aspectRatio: 1,
        borderRadius: 2,
        borderWidth: 1.3
    }
});

export default AnimatedCheckboxButton;
