import React, { FC } from "react";

import { FontAwesome } from "@expo/vector-icons";

type Props = {
    size: number;
    color: string;
};

const PencilIcon: FC<Props> = ({ size = 24, color = "black" }) => {
    return <FontAwesome name="pencil" size={size} color={color} />;
};
export default PencilIcon;
