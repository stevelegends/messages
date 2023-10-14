import React, { FC } from "react";

// modules
import { TouchableOpacity, ViewProps } from "react-native";
import { AntDesign } from "@expo/vector-icons";

// hooks
import { useTheme } from "@react-navigation/native";

type BackButtonProps = {
    id?: string;
    onPress: (id?: string) => void;
    size?: number;
    color?: string;
} & ViewProps;

const CloseButtonBorder: FC<BackButtonProps> = props => {
    const theme = useTheme();

    const handleOnPress = () => {
        props.onPress && props.onPress(props.id);
    };

    return (
        <TouchableOpacity {...props} onPress={handleOnPress}>
            <AntDesign
                name="closecircleo"
                size={props.size}
                color={props.color || theme.colors.primary}
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
