import React, { FC } from "react";
import { Image } from "react-native";

// theme
import { globalSize } from "@theme/theme";

type AppLogoImage = {
    size?: number;
    type: "light" | "dark" | "primary";
};

const ImageLogoTypeSource = {
    light: require("@assets/app-icon-white.png"),
    dark: require("@assets/app-icon-black.png"),
    primary: require("@assets/app-icon-primary.png")
};

const AppLogoImage: FC<AppLogoImage> = props => {
    return (
        <Image
            style={{ width: props.size, height: props.size }}
            resizeMode="contain"
            source={ImageLogoTypeSource[props.type]}
        />
    );
};

AppLogoImage.defaultProps = {
    size: globalSize.screenWidth / 4,
    type: "primary"
};

export default AppLogoImage;
