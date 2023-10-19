import React, { FC, useCallback, useEffect } from "react";

// modules
import { StyleSheet, TouchableOpacity, View } from "react-native";
import Animated, {
    interpolate,
    useAnimatedStyle,
    useSharedValue,
    withTiming
} from "react-native-reanimated";
import { EvilIcons } from "@expo/vector-icons";

// components
import Text from "./atoms/text";

// theme
import { AppSize, AppStyle } from "@theme/theme";

// hook
import { useTheme } from "@react-navigation/native";

type Props = {
    height?: number;
    show?: boolean;
    title?: string;
    message?: string;
};

const NotificationView: FC<Props> = props => {
    const theme = useTheme();
    const value = useSharedValue(0);
    const animatedViewStyle = useAnimatedStyle(() => {
        return {
            height: value.value,
            transform: [
                { translateY: interpolate(value.value, [props.height || 100, 0], [0, -100]) }
            ]
        };
    }, []);

    const handleHideOnPress = useCallback(() => {
        value.value = withTiming(0);
    }, []) as () => void;

    useEffect(() => {
        if (props.show) {
            value.value = withTiming(props.height || 100);
        } else {
            value.value = withTiming(0);
        }
    }, [props.show]);

    return (
        <Animated.View
            style={[
                animatedViewStyle,
                styles.container,
                { backgroundColor: theme.dark ? theme.colors.border : "#FCF8E3" }
            ]}
        >
            <View style={styles.view}>
                <View style={[AppStyle["flex-1"]]}>
                    <Text
                        style={{
                            color: theme.dark ? "#FCF8E3" : "#8E6C40",
                            fontFamily: "Roboto-Black",
                            fontSize: 12
                        }}
                    >
                        {props.title}
                    </Text>
                    <Text style={{ color: theme.dark ? "#FCF8E3" : "#886D5B", fontSize: 12 }}>
                        {props.message}
                    </Text>
                </View>
                <TouchableOpacity style={styles.button} onPress={handleHideOnPress}>
                    <EvilIcons
                        name="close-o"
                        size={30}
                        color={theme.dark ? "#FCF8E3" : "#8E6C40"}
                    />
                </TouchableOpacity>
            </View>
        </Animated.View>
    );
};

const styles = StyleSheet.create({
    container: {
        borderColor: "#F5F0DC",
        borderWidth: 1,
        borderRadius: 3,
        justifyContent: "center",
        alignItems: "center",
        paddingHorizontal: 15
    },
    view: {
        flexDirection: "row",
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        overflow: "scroll"
    },
    button: {
        width: AppSize.box,
        height: AppSize.box,
        justifyContent: "center",
        alignItems: "center"
    }
});

export default NotificationView;
