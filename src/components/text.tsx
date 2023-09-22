import React, { FC } from "react";
import { TextProps as RNTextProps, Text as RNText, TextStyle } from "react-native";

// constants
import FontMap from "@constants/font-map";
import { useTheme } from "@react-navigation/native";

type TextProps = {
    style?: {
        fontFamily?: keyof typeof FontMap;
    } & TextStyle;
} & RNTextProps;

const Text: FC<TextProps> = props => {
    const theme = useTheme();
    return (
        <RNText
            {...props}
            style={[
                props.style,
                { color: props.style?.color || theme.colors.text },
                props.style
                    ? { fontFamily: props.style.fontFamily as string }
                    : { fontFamily: "Roboto-Regular" }
            ]}
        />
    );
};

export default Text;
