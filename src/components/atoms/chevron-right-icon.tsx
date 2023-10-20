import React, { FC } from "react";

import { EvilIcons } from "@expo/vector-icons";

type Props = {
    size: number;
    color: string;
};

const ChevronRightIcon: FC<Props> = ({ size = 24, color = "black" }) => {
    return <EvilIcons name="chevron-right" size={size} color={color} />;
};

export default ChevronRightIcon;
