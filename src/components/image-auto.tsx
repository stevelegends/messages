import React, { FC, useCallback, useEffect, useState } from "react";

// modules
import { Image, ImageProps, ViewStyle } from "react-native";
import Animated, {
    useAnimatedStyle,
    useSharedValue,
    withTiming,
    ZoomIn
} from "react-native-reanimated";

// theme
import { globalSize } from "@theme/theme";

type Props = {
    wrapStyle?: ViewStyle;
} & ImageProps;

const ImageAuto: FC<Props> = props => {
    const [size, setSize] = useState<any>();
    const animatedWidth = useSharedValue(0);
    const animatedHeight = useSharedValue(0);

    const getImageSizeAsync = useCallback(async () => {
        const uri = (props.source as any).uri;
        return new Promise(resolve => {
            Image.getSize(uri, (width, height) => {
                resolve({ width, height });
            });
        });
    }, [props.source]) as () => Promise<{ width: number; height: number }>;

    const getImageSize = async () => {
        const size = await getImageSizeAsync();
        const ratio = size.width / size.height;
        const height = globalSize.screenWidth / 3;
        const width = height * ratio;
        animatedWidth.value = withTiming(width);
        animatedHeight.value = withTiming(height);
        setSize({ width, height });
    };

    const animatedImageStyle = useAnimatedStyle(() => {
        return {
            width: animatedWidth.value,
            height: animatedHeight.value
        };
    }, []);

    useEffect(() => {
        getImageSize();
    }, []);

    return (
        <Animated.View entering={ZoomIn} style={[animatedImageStyle, props.wrapStyle]}>
            {size && (
                <Image
                    {...props}
                    source={{ uri: (props.source as any).uri }}
                    style={{ width: size.width, height: size.height }}
                />
            )}
        </Animated.View>
    );
};

export default ImageAuto;
