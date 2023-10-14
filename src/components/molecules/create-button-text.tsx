import React, { FC } from "react";

// modules
import { TouchableOpacity, TouchableOpacityProps } from "react-native";
import { Trans } from "@lingui/macro";

// components
import Text from "../atoms/text";

// hooks
import { useTheme } from "@react-navigation/native";

type Props = {
    onPress: () => void;
} & TouchableOpacityProps;

const CreateButtonText: FC<Props> = props => {
    const theme = useTheme();
    return (
        <TouchableOpacity {...props} onPress={props.onPress}>
            <Text
                style={{
                    color: theme.colors.primary,
                    fontSize: 15,
                    opacity: props.disabled ? 0.3 : 1
                }}
            >
                <Trans>Create</Trans>
            </Text>
        </TouchableOpacity>
    );
};

CreateButtonText.defaultProps = {
    onPress: () => undefined
};

export default CreateButtonText;
