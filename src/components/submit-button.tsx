// react
import React, { FC, ReactElement } from "react";

// modules
import {
    ActivityIndicator,
    StyleSheet,
    Text,
    TextStyle,
    TouchableOpacity,
    TouchableOpacityProps
} from "react-native";

// hooks
import { useTheme } from "@react-navigation/native";

type SubmitButtonProps = {
    title?: string | ReactElement;
    titleStyle?: TextStyle;
    loading?: boolean;
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
            disabled={props.disabled || props.loading}
        >
            <Text
                style={[
                    { color: theme.colors.background, opacity: props.disabled ? 0.5 : 1 },
                    props.titleStyle
                ]}
            >
                {props.loading ? " " : props.title}
            </Text>
            {props.loading ? (
                <ActivityIndicator color={theme.colors.text} style={[StyleSheet.absoluteFill]} />
            ) : null}
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
