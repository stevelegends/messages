import React, { FC } from "react";

// modules
import { TouchableOpacity, TouchableOpacityProps } from "react-native";
import { Trans } from "@lingui/macro";

// components
import Text from "./text";

// hooks
import { useTheme } from "@react-navigation/native";

type Props = {
    onPress: () => void;
} & TouchableOpacityProps;

const CloseButtonText: FC<Props> = props => {
    const theme = useTheme();
    return (
        <TouchableOpacity {...props} onPress={props.onPress}>
            <Text style={{ color: theme.colors.primary, fontSize: 15 }}>
                <Trans>Close</Trans>
            </Text>
        </TouchableOpacity>
    );
};

CloseButtonText.defaultProps = {
    onPress: () => undefined
};

export default CloseButtonText;
