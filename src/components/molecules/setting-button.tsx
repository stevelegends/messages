import React, { FC } from "react";

// modules
import { TouchableOpacity, ViewStyle } from "react-native";

// components
import { SettingIcon } from "@atoms";

// hooks
import { useTheme } from "@react-navigation/native";

// theme
import { AppColor } from "@theme/theme";

type Props = {
    id?: string;
    size: number;
    onPress: (id?: string) => void;
    style?: ViewStyle;
};

const SettingButton: FC<Props> = ({ id, size = 24, onPress, style }) => {
    const theme = useTheme();

    const handleOnPress = () => {
        onPress && onPress(id);
    };

    return (
        <TouchableOpacity onPress={handleOnPress} style={style}>
            <SettingIcon size={size} color={theme.dark ? AppColor.white : AppColor["black-2"]} />
        </TouchableOpacity>
    );
};

export default SettingButton;
