// react
import React, { FC } from "react";

// modules
import { StyleSheet, TouchableOpacity, View } from "react-native";
import Animated, { ZoomIn, ZoomOut } from "react-native-reanimated";
import { Ionicons } from "@expo/vector-icons";

// theme
import { globalSize, globalStyles } from "@theme/theme";

// hooks
import { useTheme } from "@react-navigation/native";

type Props = {
    onPress: () => void;
};

const CreateButton: FC<Props> = props => {
    const theme = useTheme();

    return (
        <View style={[globalStyles["flex-jc-center"], styles.container]}>
            <TouchableOpacity onPress={props.onPress}>
                <Animated.View entering={ZoomIn} exiting={ZoomOut}>
                    <Ionicons name="create-outline" size={24} color={theme.colors.primary} />
                </Animated.View>
            </TouchableOpacity>
        </View>
    );
};

CreateButton.defaultProps = {
    onPress: () => undefined
};

const styles = StyleSheet.create({
    container: {
        paddingHorizontal: globalSize.paddingButton
    }
});

export default CreateButton;
