// react
import React, { FC } from "react";

// modules
import { View, ViewProps } from "react-native";

// theme
import { globalStyles } from "@theme/theme";

type PageContainerProps = {} & ViewProps;

const PageContainer: FC<PageContainerProps> = props => {
    return (
        <View
            {...props}
            style={[globalStyles["flex-1"], globalStyles["paddingH-20"], props.style]}
        />
    );
};

export default PageContainer;
