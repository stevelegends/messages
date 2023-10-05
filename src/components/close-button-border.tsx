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

const CloseButtonBorder: FC<BackButtonProps> = props => {
    const theme = useTheme();

    return (
        <TouchableOpacity {...props} onPress={props.onPress}>
            <AntDesign
                name="closecircleo"
                size={props.size}
                color={theme.colors.primary}
                style={{ alignSelf: "center" }}
            />
        </TouchableOpacity>
    );
};

CloseButtonBorder.defaultProps = {
    onPress: () => undefined,
    size: 30
};

export default CloseButtonBorder;
