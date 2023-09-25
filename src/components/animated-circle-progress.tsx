import React from "react";

// modules
import { PixelRatio, StyleSheet } from "react-native";
import { Circle, Svg } from "react-native-svg";
import Animated, {
    interpolate,
    SharedValue,
    useAnimatedProps,
    useAnimatedReaction,
    useAnimatedStyle,
    useSharedValue,
    withTiming
} from "react-native-reanimated";

type ReadOnlyProps<T> = {
    readonly [P in keyof T]: T[P];
};

interface AnimatedCircularProgressProps {
    radius?: number;
    color?: string;
    percentage?: SharedValue<number>;
    borderWidth?: number;
    duration?: number;
}

const AnimatedCircle = Animated.createAnimatedComponent(Circle);

const AnimatedCircleProgress: React.FC<ReadOnlyProps<AnimatedCircularProgressProps>> = ({
    radius = 100,
    color = "#ff457a",
    percentage,
    borderWidth = 20,
    duration = 500
}) => {
    const loaderRadius = PixelRatio.roundToNearestPixel(radius);
    const innerCircleRadii = loaderRadius - borderWidth / 2;
    const circumference = 2 * Math.PI * innerCircleRadii;

    const progress = useSharedValue(2 * Math.PI * innerCircleRadii);
    const hidden = useSharedValue(1);

    const animatedStrokeDashOffset = useAnimatedProps(() => {
        return {
            strokeDashoffset: withTiming(progress.value, {
                duration
            })
        };
    }, []);

    const animatedStyle = useAnimatedStyle(() => {
        return {
            opacity: withTiming(progress.value === 0 ? 0 : 1, { duration })
        };
    }, []);

    useAnimatedReaction(
        () => percentage,
        (prepareResult, preparePreviousResult) => {
            if (prepareResult?.value !== undefined) {
                const perc = prepareResult?.value <= 100 ? prepareResult?.value : 100;
                const circumferencePercentage = circumference * perc * 0.01;
                const calcPercentage = circumference - circumferencePercentage;
                progress.value = calcPercentage;
            }
        },
        []
    );

    return (
        <Svg style={styles(radius).svg}>
            <AnimatedCircle
                style={animatedStyle}
                cx={radius}
                cy={radius}
                fill="transparent"
                r={innerCircleRadii}
                stroke={color}
                strokeWidth={borderWidth}
                animatedProps={animatedStrokeDashOffset}
                strokeDasharray={circumference}
                strokeDashoffset={circumference}
                strokeLinecap="round"
            />
        </Svg>
    );
};

const styles = (radius: number) =>
    StyleSheet.create({
        svg: {
            width: 2 * radius,
            height: 2 * radius
        }
    });

export default AnimatedCircleProgress;
