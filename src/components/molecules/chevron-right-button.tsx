import React, { FC } from "react";

// modules
import { TouchableOpacity } from "react-native";

// components
import { ChevronRightIcon } from "@atoms";

// hooks
import { useTheme } from "@react-navigation/native";

type Props = {
    id?: string;
    size: number;
    color?: string;
    onPress: (id?: string) => void;
};

const ChevronRightButton: FC<Props> = ({ id, size = 24, color, onPress }) => {
    const theme = useTheme();

    const handleOnPress = () => {
        onPress && onPress(id);
    };

    return (
        <TouchableOpacity onPress={handleOnPress}>
            <ChevronRightIcon size={size} color={color || theme.colors.primary} />
        </TouchableOpacity>
    );
};

export default ChevronRightButton;
