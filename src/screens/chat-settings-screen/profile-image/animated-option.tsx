import React, { FC, Fragment } from "react";

// modules
import Animated, { ZoomIn, ZoomOut } from "react-native-reanimated";
import { StyleSheet, View } from "react-native";
import { TouchableOpacity } from "react-native-gesture-handler";

// components
import { Text } from "@atoms";

// hooks
import { useTheme } from "@react-navigation/native";

// theme
import { AppSize } from "@theme/theme";
import { useLingui } from "@lingui/react";
import { t } from "@lingui/macro";

type option = {
    id: string;
    title?: string;
    onPress: (id: string) => void;
    disabled?: boolean;
};

type AnimatedOptionProps = {
    show?: boolean;
    options: Array<option>;
    cancelOnPress: (show: boolean) => void;
};

const AnimatedOption: FC<AnimatedOptionProps> = props => {
    const theme = useTheme();
    const { i18n } = useLingui();

    return (
        <Fragment>
            {props.show && (
                <Animated.View
                    entering={ZoomIn}
                    exiting={ZoomOut}
                    style={[
                        styles.container,
                        { backgroundColor: theme.dark ? theme.colors.border : "white" }
                    ]}
                >
                    {props.options.map(({ title, id, onPress, disabled }) => (
                        <Fragment key={id}>
                            <TouchableOpacity
                                disabled={disabled}
                                onPress={() => onPress(id)}
                                style={[styles.button, { opacity: disabled ? 0.3 : 1 }]}
                            >
                                <Text>{title}</Text>
                            </TouchableOpacity>
                            <View
                                style={[
                                    styles.separate,
                                    {
                                        backgroundColor: theme.dark
                                            ? theme.colors.background
                                            : theme.colors.background
                                    }
                                ]}
                            />
                        </Fragment>
                    ))}
                    <TouchableOpacity
                        onPress={() => props.cancelOnPress(false)}
                        style={styles.button}
                    >
                        <Text style={{ color: theme.colors.primary }}>{t(i18n)`Cancel`}</Text>
                    </TouchableOpacity>
                </Animated.View>
            )}
        </Fragment>
    );
};

AnimatedOption.defaultProps = {
    options: [],
    cancelOnPress: () => undefined
};

const styles = StyleSheet.create({
    container: {
        position: "absolute",
        bottom: 0,
        width: 150,
        borderRadius: 5,
        left: AppSize.screenWidth / 4 - 30,
        zIndex: 1,

        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,

        elevation: 5
    },
    button: {
        paddingVertical: 10,
        alignItems: "center"
    },
    separate: {
        width: "100%",
        height: 1
    }
});

export default AnimatedOption;
