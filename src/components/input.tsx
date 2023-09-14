// react
import React, { FC, Fragment, ReactElement } from "react";

// modules
import { StyleSheet, TextInput, TextInputProps, View, Text } from "react-native";
import Animated, { FadeIn, FadeOut } from "react-native-reanimated";

// hooks
import { useTheme } from "@react-navigation/native";
import { useController } from "react-hook-form";

type InputProps = {
    label?: string | ReactElement;
    icon?: any;
    iconPack?: any;
    iconSize?: number;
    errorText?: string;
    control: any;
    name: string;
    rightView?: ReactElement;
} & TextInputProps;

const Input: FC<InputProps> = props => {
    const { label, icon, iconPack, iconSize, errorText } = props;
    const theme = useTheme();
    const { field } = useController({
        control: props.control,
        name: props.name,
        defaultValue: ""
    });
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
                    value={field.value}
                    onChangeText={field.onChange}
                    style={[{ color: theme.colors.text }, styles.input, props.style]}
                />
                <View
                    style={[
                        styles.inputRightView,
                        props.rightView ? {} : { width: 0, marginLeft: 0 }
                    ]}
                >
                    {props.rightView ? <Fragment>{props.rightView}</Fragment> : null}
                </View>
            </View>

            {errorText && (
                <Animated.View entering={FadeIn} exiting={FadeOut} style={styles.errorContainer}>
                    <Text style={[styles.errorText, { color: theme.colors.notification }]}>
                        {errorText}
                    </Text>
                </Animated.View>
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
        borderRadius: 2,
        flexDirection: "row",
        alignItems: "center"
    },
    inputRightView: {
        width: 25,
        height: 45,
        marginLeft: 10,
        justifyContent: "center",
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
