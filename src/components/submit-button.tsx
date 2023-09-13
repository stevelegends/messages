// react
import React, { FC, ReactElement } from "react";

// modules
import { StyleSheet, Text, TextStyle, TouchableOpacity, TouchableOpacityProps } from "react-native";

// hooks
import { useTheme } from "@react-navigation/native";

type SubmitButtonProps = {
    title?: string | ReactElement;
    titleStyle?: TextStyle;
} & TouchableOpacityProps;

const SubmitButton: FC<SubmitButtonProps> = props => {
    const theme = useTheme();

    return (
        <TouchableOpacity
            {...props}
            style={[
                styles.container,
                { backgroundColor: theme.colors.primary, opacity: props.disabled ? 0.5 : 1 },
                props.style
            ]}
        >
            <Text
                style={[
                    { color: theme.colors.background, opacity: props.disabled ? 0.5 : 1 },
                    props.titleStyle
                ]}
            >
                {props.title}
            </Text>
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    container: {
        paddingHorizontal: 30,
        paddingVertical: 10,
        borderRadius: 30,
        justifyContent: "center",
        alignItems: "center"
    }
});

export default SubmitButton;
