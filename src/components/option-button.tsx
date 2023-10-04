import React, { FC } from "react";

// modules
import { StyleSheet, TouchableOpacity, TouchableOpacityProps } from "react-native";
import { SimpleLineIcons } from "@expo/vector-icons";

type Props = {
    onPress: () => void;
    size: number;
    buttonSize: number;
    color?: string;
} & TouchableOpacityProps;

const OptionButton: FC<Props> = props => {
    return (
        <TouchableOpacity
            {...props}
            onPress={props.onPress}
            style={[
                props.style,
                styles.button,
                { width: props.buttonSize, height: props.buttonSize }
            ]}
        >
            <SimpleLineIcons
                name="options-vertical"
                size={props.size}
                color={props.color}
                style={{ alignSelf: "center" }}
            />
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    button: {
        justifyContent: "center",
        alignItems: "center"
    }
});

OptionButton.defaultProps = {
    onPress: () => undefined,
    size: 30,
    buttonSize: 50,
    color: "black"
};

export default OptionButton;
