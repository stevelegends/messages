import React, { FC } from "react";

// modules
import {
    ActivityIndicator,
    StyleSheet,
    TouchableOpacity,
    TouchableOpacityProps
} from "react-native";
import { Trans } from "@lingui/macro";
import Animated, { ZoomIn } from "react-native-reanimated";

// components
import Text from "../atoms/text";

// hooks
import { useTheme } from "@react-navigation/native";

type Props = {
    onPress: () => void;
    isLoading?: boolean;
} & TouchableOpacityProps;

const SaveButtonText: FC<Props> = props => {
    const theme = useTheme();
    return (
        <TouchableOpacity {...props} onPress={props.onPress}>
            <Text
                style={{
                    color: theme.colors.primary,
                    fontSize: 15,
                    opacity: props.isLoading ? 0 : props.disabled ? 0.3 : 1
                }}
            >
                <Trans>Save</Trans>
            </Text>
            {props.isLoading && (
                <Animated.View style={StyleSheet.absoluteFill} entering={ZoomIn}>
                    <ActivityIndicator color={theme.colors.primary} />
                </Animated.View>
            )}
        </TouchableOpacity>
    );
};

SaveButtonText.defaultProps = {
    onPress: () => undefined
};

export default SaveButtonText;
