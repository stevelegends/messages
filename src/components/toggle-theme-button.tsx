// react
import React from "react";

// modules
import { Switch, View } from "react-native";

// components
import { Text } from "./index";

// contexts
import { useThemeProvider } from "@contexts/theme-context";

// theme
import { globalStyles } from "@theme/theme";

// utils
import { capitalizeFirstLetter } from "@utils";

const ToggleThemeButton = () => {
    const { isDark, setToggleScheme, scheme } = useThemeProvider();

    return (
        <View style={[globalStyles["paddingR-10"], globalStyles["horizontal-center"]]}>
            <Text style={{ fontFamily: "Roboto-Bold", ...globalStyles["marginR-5"] }}>
                {capitalizeFirstLetter(scheme as string)}
            </Text>
            <Switch value={isDark} onValueChange={setToggleScheme} />
        </View>
    );
};

export default ToggleThemeButton;
