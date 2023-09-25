// react
import React, { FC, memo, useMemo } from "react";

// modules
import {
    ActivityIndicator,
    ImageProps,
    Pressable,
    StyleSheet,
    Image,
    ImageStyle
} from "react-native";
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
    style?: ImageStyle;
} & ImageProps;

const CircleImage: FC<CircleImage> = memo(props => {
    useRenderTracker(["CircleImage"]);

    const theme = useTheme();

    const imageCachedStyle = useMemo(() => {
        return {
            backgroundColor: theme.colors.card,
            borderColor: theme.colors.text,
            borderWidth: 1,
            ...(props.style as ImageStyle),
            width: props.size,
            height: props.size,
            borderRadius: (props.size || 0) / 2
        };
    }, [props.size, props.style, theme.dark]) as ImageStyle;

    return (
        <Pressable onPress={props.onPress}>
            {props.source && (props.source as any)?.uri.startsWith("https://") ? (
                <CachedImageV2 {...props} style={imageCachedStyle} />
            ) : (
                <Image {...props} style={imageCachedStyle} />
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
