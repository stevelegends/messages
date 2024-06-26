import React, { FC } from "react";

// modules
import { TouchableOpacity, TouchableOpacityProps } from "react-native";
import { AntDesign } from "@expo/vector-icons";

// hooks
import { useTheme } from "@react-navigation/native";

type BackButtonProps = {
    onPress: () => void;
    size?: number;
} & TouchableOpacityProps;

const CloseButton: FC<BackButtonProps> = props => {
    const theme = useTheme();

    return (
        <TouchableOpacity {...props} onPress={props.onPress}>
            <AntDesign
                name="close"
                size={props.size}
                color={theme.colors.primary}
                style={{ alignSelf: "center" }}
            />
        </TouchableOpacity>
    );
};

CloseButton.defaultProps = {
    onPress: () => undefined,
    size: 30
};

export default CloseButton;
