import React, { FC } from "react";

// modules
import { TouchableOpacity } from "react-native";

// components
import { ArrowLeftIcon } from "@atoms";

// hooks
import { useTheme } from "@react-navigation/native";

type Props = {
    id?: string;
    size: number;
    onPress: (id?: string) => void;
};

const ArrowLeftButton: FC<Props> = ({ id, size = 24, onPress }) => {
    const theme = useTheme();

    const handleOnPress = () => {
        onPress && onPress(id);
    };

    return (
        <TouchableOpacity onPress={handleOnPress}>
            <ArrowLeftIcon size={size} color={theme.colors.primary} />
        </TouchableOpacity>
    );
};

export default ArrowLeftButton;
