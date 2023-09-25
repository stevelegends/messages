// react
import React, { FC, memo } from "react";

// modules
import { ActivityIndicator, ImageProps, Pressable, StyleSheet, Image } from "react-native";
import Animated, { ZoomIn, ZoomOut } from "react-native-reanimated";

// hooks
import { useTheme } from "@react-navigation/native";
import { useRenderTracker } from "@hooks/index";

// theme
import { globalSize } from "@theme/theme";

// components
import CachedImageV2 from "./cached-image-v2";

type CircleImage = {
    size?: number;
    onPress?: () => void;
    loading?: boolean;
} & ImageProps;

const CircleImage: FC<CircleImage> = memo(props => {
    useRenderTracker(["CircleImage"]);

    const theme = useTheme();

    return (
        <Pressable onPress={props.onPress}>
            {props.source && (props.source as any)?.uri.startsWith("https://") ? (
                <CachedImageV2
                    source={props.source}
                    style={{
                        width: props.size,
                        aspectRatio: 1,
                        borderRadius: (props.size || 0) / 2,
                        backgroundColor: theme.colors.card,
                        borderColor: theme.colors.text,
                        borderWidth: 1
                    }}
                />
            ) : (
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
            )}

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
});

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
