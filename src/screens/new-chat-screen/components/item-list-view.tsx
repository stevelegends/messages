import React, { FC, useMemo } from "react";

// modules
import { StyleSheet, TouchableWithoutFeedback, View } from "react-native";
import Animated, { FadeIn, FadeOut } from "react-native-reanimated";

// components
import { CircleImage, Text } from "@components";

// hooks
import { useTheme } from "@react-navigation/native";

// constants
import { UserStatus } from "@constants/user-status";

type Props = {
    index: number;
    id: string;
    title: string;
    subTitle: string;
    image: string;
    onPress: (id: string) => void;
    status?: UserStatus;
};

const ItemListView: FC<Props> = ({ index, id, title, subTitle, image, onPress, status }) => {
    const theme = useTheme();
    const source = useMemo(() => {
        return { uri: image };
    }, [image]);
    const handleOnPress = () => {
        onPress && onPress(id);
    };
    return (
        <TouchableWithoutFeedback onPress={handleOnPress}>
            <Animated.View
                entering={FadeIn.delay(100 * index)}
                exiting={FadeOut}
                style={[styles.container, { borderBottomColor: theme.colors.border }]}
            >
                <CircleImage
                    size={40}
                    source={source}
                    placeholder={title?.[0]?.toUpperCase()}
                    status={status}
                />

                <View style={styles.textContainer}>
                    <Text
                        numberOfLines={1}
                        style={{ ...styles.title, fontFamily: "Roboto-Medium" }}
                    >
                        {title}
                    </Text>
                    {subTitle !== null && subTitle !== undefined && (
                        <Text style={{ ...styles.subTitle, fontFamily: "Roboto-Regular" }}>
                            {subTitle}
                        </Text>
                    )}
                </View>
            </Animated.View>
        </TouchableWithoutFeedback>
    );
};

const styles = StyleSheet.create({
    container: {
        flexDirection: "row",
        paddingVertical: 8,
        borderBottomWidth: 1,
        alignItems: "center",
        minHeight: 50,
        paddingHorizontal: 14
    },
    textContainer: {
        marginLeft: 14
    },
    title: {
        fontSize: 16,
        letterSpacing: 0.3
    },
    subTitle: {
        letterSpacing: 0.3
    }
});

export default ItemListView;
