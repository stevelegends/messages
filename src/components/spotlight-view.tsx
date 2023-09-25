import React, { FC, useEffect } from "react";

// modules
import Animated, {
    Easing,
    interpolateColor,
    useAnimatedStyle,
    useSharedValue,
    withRepeat,
    withTiming,
    ZoomIn,
    ZoomOut
} from "react-native-reanimated";

type Props = {
    active?: boolean;
    size: number;
};

const SpotlightView: FC<Props> = props => {
    const value = useSharedValue(0);

    const background = useAnimatedStyle(() => {
        return {
            backgroundColor: interpolateColor(value.value, [0, 1], ["red", "green"])
        };
    }, []);

    useEffect(() => {
        value.value = withTiming(props.active ? 1 : 0);
    }, [props.active]);

    return (
        <Animated.View
            entering={ZoomIn}
            exiting={ZoomOut}
            style={[
                { width: props.size, height: props.size, borderRadius: props.size / 2 },
                background
            ]}
        />
    );
};

SpotlightView.defaultProps = {
    size: 10
};

export default SpotlightView;
