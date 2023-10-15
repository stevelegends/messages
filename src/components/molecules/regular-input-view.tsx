import React, { FC } from "react";

// modules
import { StyleSheet, TextInput, View } from "react-native";
import Animated, { ZoomIn, ZoomOut } from "react-native-reanimated";

// hooks
import { useTheme } from "@react-navigation/native";

// components
import { CloseButtonBorder } from "@components";

type Props = {
    value: string;
    onChangeText: (value: string) => void;
    onClearText?: (value: string) => void;
    placeholder: string;
};

const RegularInputView: FC<Props> = ({ onChangeText, value, placeholder, onClearText }) => {
    const theme = useTheme();

    const handleClearOnPress = () => {
        onClearText && onClearText("");
    };

    return (
        <View style={[styles.container, { backgroundColor: theme.colors.card }]}>
            <TextInput
                value={value}
                onChangeText={onChangeText}
                placeholderTextColor={theme.colors.border}
                placeholder={placeholder}
                autoCorrect={false}
                autoComplete={undefined}
                style={[
                    {
                        color: theme.colors.text
                    },
                    styles.input
                ]}
            />
            {value && typeof onClearText === "function" && (
                <Animated.View entering={ZoomIn} exiting={ZoomOut} style={styles.wrapButton}>
                    <CloseButtonBorder onPress={handleClearOnPress} size={15} />
                </Animated.View>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        paddingVertical: 15,
        paddingHorizontal: 10,
        borderRadius: 5,
        marginVertical: 10,
        flexDirection: "row"
    },
    input: {
        flex: 1,
        fontFamily: "Roboto-Regular",
        letterSpacing: 0.3
    },
    wrapButton: {
        justifyContent: "center",
        alignItems: "center",
        width: 25
    }
});

export default RegularInputView;
