// react
import React, { FC, ReactElement } from "react";

// modules
import { StyleSheet, TextInput, TextInputProps, View, Text } from "react-native";

// hooks
import { useTheme } from "@react-navigation/native";

type InputProps = {
    label?: string | ReactElement;
    icon?: any;
    iconPack?: any;
    iconSize?: number;
    errorText?: string;
} & TextInputProps;

const Input: FC<InputProps> = props => {
    const { label, icon, iconPack, iconSize, errorText } = props;
    const theme = useTheme();
    return (
        <View style={styles.container}>
            <Text style={[{ color: theme.colors.text }, styles.label]}>{label}</Text>
            <View style={[styles.inputContainer, { backgroundColor: theme.colors.card }]}>
                {iconPack && icon ? (
                    <props.iconPack
                        name={icon}
                        size={iconSize}
                        color={theme.colors.text}
                        style={styles.icon}
                    />
                ) : (
                    <></>
                )}
                <TextInput
                    {...props}
                    style={[{ color: theme.colors.text }, styles.input, props.style]}
                />
            </View>

            {errorText ? (
                <View style={styles.errorContainer}>
                    <Text style={[styles.errorText, { color: theme.colors.notification }]}>
                        {errorText}
                    </Text>
                </View>
            ) : (
                <></>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        width: "100%"
    },
    inputContainer: {
        width: "100%",
        paddingHorizontal: 10,
        paddingVertical: 15,
        borderRadius: 2,
        flexDirection: "row",
        alignItems: "center"
    },
    icon: {
        marginRight: 15
    },
    label: {
        fontFamily: "Roboto-Bold",
        marginVertical: 8,
        letterSpacing: 0.3
    },
    input: {
        flex: 1,
        fontFamily: "Roboto-Regular",
        letterSpacing: 0.3,
        paddingTop: 0
    },
    errorContainer: {
        marginVertical: 5
    },
    errorText: {
        fontSize: 13,
        fontFamily: "Roboto-Regular",
        letterSpacing: 0.3
    }
});

export default Input;
