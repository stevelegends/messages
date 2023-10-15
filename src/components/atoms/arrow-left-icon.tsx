import React, { FC } from "react";

import { EvilIcons } from "@expo/vector-icons";

type Props = {
    size: number;
    color: string;
};

const ArrowLeftIcon: FC<Props> = ({ size = 24, color = "black" }) => {
    return <EvilIcons name="arrow-left" size={size} color={color} />;
};

export default ArrowLeftIcon;
