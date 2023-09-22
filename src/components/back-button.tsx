import React, { FC } from "react";

// modules
import { Ionicons } from "@expo/vector-icons";
import { TouchableOpacity, TouchableOpacityProps } from "react-native";

// hooks
import { useTheme } from "@react-navigation/native";

type BackButtonProps = {
    onPress: () => void;
} & TouchableOpacityProps;

const BackButton: FC<BackButtonProps> = props => {
    const theme = useTheme();

    return (
        <TouchableOpacity {...props} onPress={props.onPress}>
            <Ionicons
                name="chevron-back"
                size={30}
                color={theme.colors.primary}
                style={{ alignSelf: "center" }}
            />
        </TouchableOpacity>
    );
};

BackButton.defaultProps = {
    onPress: () => undefined
};

export default BackButton;
