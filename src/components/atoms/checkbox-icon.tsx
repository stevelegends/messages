import React, { FC } from "react";

import { Ionicons } from "@expo/vector-icons";

type Props = {
    size: number;
    color: string;
    checked?: boolean;
};

const CheckboxIcon: FC<Props> = ({ size = 24, color = "black", checked }) => {
    return (
        <Ionicons
            name={checked ? "ios-checkbox" : "ios-checkbox-outline"}
            size={size}
            color={color}
        />
    );
};

export default CheckboxIcon;
