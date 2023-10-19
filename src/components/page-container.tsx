// react
import React, { FC } from "react";

// modules
import { View, ViewProps } from "react-native";

// theme
import { AppStyle } from "@theme/theme";

type PageContainerProps = {} & ViewProps;

const PageContainer: FC<PageContainerProps> = props => {
    return <View {...props} style={[AppStyle["flex-1"], AppStyle["paddingH-20"], props.style]} />;
};

export default PageContainer;
