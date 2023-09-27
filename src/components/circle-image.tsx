// react
import React, { FC, memo, useMemo } from "react";

// modules
import {
    ActivityIndicator,
    ImageProps,
    Pressable,
    StyleSheet,
    Image,
    ImageStyle,
    Text,
    View,
    TextStyle
} from "react-native";
import Animated, { ZoomIn, ZoomOut } from "react-native-reanimated";

// hooks
import { useTheme } from "@react-navigation/native";
import { useRenderTracker } from "@hooks/index";

// theme
import { globalSize, globalStyles } from "@theme/theme";

// components
import CachedImageV2 from "./cached-image-v2";

// utils
import { getRandomDarkColor, getRandomLightColor } from "@utils";

type CircleImage = {
    size?: number;
    onPress?: () => void;
    loading?: boolean;
    style?: ImageStyle;
    cached?: boolean;
    placeholder?: string;
    placeholderStyle?: TextStyle;
} & ImageProps;

const CircleImage: FC<CircleImage> = memo(props => {
    useRenderTracker(["CircleImage"]);

    const theme = useTheme();

    const randomColor = useMemo(() => {
        return theme.dark ? getRandomDarkColor() : getRandomLightColor();
    }, [theme.dark]);

    const imageCachedStyle = useMemo(() => {
        return {
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
            {props.placeholder !== null && props.placeholder !== undefined && (
                <View
                    style={[
                        StyleSheet.absoluteFill,
                        globalStyles["flex-center"],
                        {
                            width: props.size,
                            aspectRatio: 1,
                            borderRadius: (props.size || 0) / 2,
                            backgroundColor: randomColor
                        }
                    ]}
                >
                    <Text
                        style={[
                            styles.placeholder,
                            { color: theme.colors.text },
                            props.placeholderStyle
                        ]}
                    >
                        {props.placeholder}
                    </Text>
                </View>
            )}
            {props.cached && props.source && (props.source as any)?.uri?.startsWith("https://") ? (
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
    },
    placeholder: {
        fontFamily: "Roboto-Black",
        fontSize: 12
    }
});

CircleImage.defaultProps = {
    onPress: () => undefined,
    loading: false,
    size: globalSize.screenWidth
};

export default CircleImage;
