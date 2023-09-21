// react
import React, { FC } from "react";

// modules
import { ActivityIndicator, Image, ImageProps, Pressable, StyleSheet } from "react-native";
import Animated, { ZoomIn, ZoomOut } from "react-native-reanimated";

// hooks
import { useTheme } from "@react-navigation/native";

// theme
import { globalSize } from "@theme/theme";

type CircleImage = {
    size?: number;
    onPress?: () => void;
    loading?: boolean;
} & ImageProps;

const CircleImage: FC<CircleImage> = props => {
    const theme = useTheme();
    return (
        <Pressable onPress={props.onPress}>
            <Image
                {...props}
                style={[
                    {
                        width: props.size,
                        aspectRatio: 1,
                        borderRadius: (props.size || 0) / 2,
                        backgroundColor: theme.colors.card,
                        borderColor: theme.colors.text,
                        borderWidth: 1
                    },
                    props.style
                ]}
            />
            {props.loading && (
                <Animated.View style={StyleSheet.absoluteFill} entering={ZoomIn} exiting={ZoomOut}>
                    <ActivityIndicator style={StyleSheet.absoluteFill} color={theme.colors.text} />
                </Animated.View>
            )}
        </Pressable>
    );
};

CircleImage.defaultProps = {
    onPress: () => undefined,
    loading: false,
    size: globalSize.screenWidth
};

export default CircleImage;
