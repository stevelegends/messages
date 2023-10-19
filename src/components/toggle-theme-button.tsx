// react
import React from "react";

// modules
import { Pressable, View } from "react-native";
import { Feather } from "@expo/vector-icons";
import Animated, { RotateInUpLeft, RotateOutUpLeft } from "react-native-reanimated";

// contexts
import { useThemeProvider } from "@contexts/theme-context";

// theme
import { AppStyle } from "@theme/theme";

// hooks
import { useTheme } from "@react-navigation/native";

const ToggleThemeButton = () => {
    const { isDark, setToggleScheme } = useThemeProvider();
    const theme = useTheme();

    return (
        <View style={[AppStyle["paddingR-10"], AppStyle["horizontal-center"]]}>
            <Pressable onPress={() => setToggleScheme()}>
                {isDark && (
                    <Animated.View entering={RotateInUpLeft} exiting={RotateOutUpLeft}>
                        <Feather name="sun" size={24} color={theme.colors.text} />
                    </Animated.View>
                )}
                {!isDark && (
                    <Animated.View entering={RotateInUpLeft} exiting={RotateOutUpLeft}>
                        <Feather name="moon" size={24} color={theme.colors.text} />
                    </Animated.View>
                )}
            </Pressable>
        </View>
    );
};

export default ToggleThemeButton;
