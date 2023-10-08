import React, { FC, memo, useEffect, useRef } from "react";

// modules
import { Image, ScrollView, StyleSheet, View, ViewStyle } from "react-native";
import Animated, { SlideInRight, ZoomIn, ZoomOut } from "react-native-reanimated";

// components
import { CloseButtonBorder, ImageAuto, Text } from "@components";

// theme
import { globalColor, globalSize } from "@theme/theme";

// hooks
import { Theme, useTheme } from "@react-navigation/native";

export type ImageAttaches = {
    key: string;
    uri: string;
    resize: {
        size: number;
        origin: {
            width: number;
            height: number;
        };
    };
};

type Props = {
    images?: Array<ImageAttaches>;
    attaches?: Array<string>;
    removeOnPress: (key: string) => void;
};

const ImageAttachesView: FC<Props> = memo(({ images, attaches, removeOnPress }) => {
    const theme = useTheme();
    const scrollRef = useRef<ScrollView>();

    function onScrollToEnd() {
        if (scrollRef.current) {
            scrollRef.current?.scrollToEnd({ animated: true });
        }
    }

    const handleRemoveOnPress = (key: string) => {
        removeOnPress && removeOnPress(key);
    };

    useEffect(() => {
        if (images && images.length > 0) {
            setTimeout(() => {
                onScrollToEnd();
            }, 300);
        }
    }, [images?.length]);

    return (
        <View style={{ flexDirection: "row" }}>
            <ScrollView
                ref={component => {
                    component && (scrollRef.current = component);
                }}
                horizontal
                showsHorizontalScrollIndicator={false}
            >
                {images &&
                    images.map((value, index) => {
                        const ratio = value.resize.origin.width / value.resize.origin.height;
                        const height = globalSize.screenWidth / 3;
                        const width = height * ratio;
                        return (
                            <Animated.View
                                entering={SlideInRight}
                                exiting={ZoomOut}
                                key={index.toString()}
                                style={wrapImageStyle(index)}
                            >
                                <Image source={{ uri: value.uri }} style={{ width, height }} />
                                <CloseButtonBorder
                                    style={styles.button}
                                    size={20}
                                    color={globalColor.white}
                                    onPress={() => handleRemoveOnPress(value.key)}
                                />
                            </Animated.View>
                        );
                    })}
                {attaches &&
                    attaches.map((url, index) => (
                        <ImageAuto
                            key={index}
                            wrapStyle={wrapImageStyle(index)}
                            source={{ uri: url }}
                        />
                    ))}
            </ScrollView>
            {images && images.length > 0 && (
                <Animated.View entering={ZoomIn} style={wrapCountStyle(theme)}>
                    <Text style={{ fontFamily: "Roboto-Regular" }}>{images.length}/5</Text>
                </Animated.View>
            )}
        </View>
    );
});

const styles = StyleSheet.create({
    button: {
        position: "absolute",
        right: 8,
        top: 8,
        backgroundColor: globalColor["black-0.2"],
        borderRadius: 10
    }
});

const wrapCountStyle = (theme: Theme): ViewStyle => {
    return {
        position: "absolute",
        left: 8,
        alignSelf: "center",
        backgroundColor: theme.dark ? globalColor["black-0.5"] : globalColor["white-0.5"],
        padding: 4,
        borderRadius: 4
    };
};

const wrapImageStyle = (index: number): ViewStyle => {
    return {
        marginRight: 8,
        marginLeft: index === 0 ? 8 : 0,
        marginBottom: 8,
        borderRadius: 4,
        overflow: "hidden"
    };
};

export default ImageAttachesView;
