import React, { FC } from "react";

import { AntDesign } from "@expo/vector-icons";

type Props = {
    size: number;
    color: string;
};

const SettingIcon: FC<Props> = ({ size = 24, color = "black" }) => {
    return <AntDesign name="setting" size={size} color={color} />;
};
export default SettingIcon;
