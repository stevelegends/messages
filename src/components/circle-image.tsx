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
                <Animated.View
                    entering={ZoomIn}
                    exiting={ZoomOut}
                    style={[
                        StyleSheet.absoluteFill,
                        { borderRadius: (props.size || 0) / 2 },
                        styles.backdropLoading
                    ]}
                >
                    <ActivityIndicator style={StyleSheet.absoluteFill} color="white" />
                </Animated.View>
            )}
        </Pressable>
    );
};

const styles = StyleSheet.create({
    backdropLoading: {
        backgroundColor: "black",
        opacity: 0.4
    }
});

CircleImage.defaultProps = {
    onPress: () => undefined,
    loading: false,
    size: globalSize.screenWidth
};

export default CircleImage;
