import React, { FC, useRef, useState } from "react";

// modules
import { ScrollView, StyleSheet, View } from "react-native";
import Animated, { SlideInLeft, SlideOutLeft, ZoomIn, ZoomOut } from "react-native-reanimated";

// theme
import { globalColor, globalSize, globalStyles } from "@theme/theme";

// components
import { CircleImage, CloseButtonBorder } from "@components";
import { Text } from "@atoms";
import ArrowLeftButton from "../molecules/arrow-left-button";

// hooks
import { useTheme } from "@react-navigation/native";

type Props = {
    data: Array<{
        id: string;
        imageUrl: string;
        placeholder: string;
        title: string;
    }>;
    onPress?: (id?: string) => void;
    removeOnPress?: (id?: string) => void;
};

const AnimatedCircleImagesWrapView: FC<Props> = ({ data, onPress, removeOnPress }) => {
    const theme = useTheme();
    const scrollRef = useRef<ScrollView>();

    const [isMore, setIsMore] = useState<boolean>(false);

    const onScrollToEnd = () => {
        if (scrollRef.current) {
            scrollRef.current.scrollToEnd();
        }
    };

    const handleArrowLeftOnPress = () => {
        if (scrollRef.current) {
            scrollRef.current?.scrollTo({ x: 0, animated: true });
        }
    };

    return (
        <View style={styles.container}>
            <ScrollView
                ref={component => {
                    component && (scrollRef.current = component);
                }}
                horizontal
                showsHorizontalScrollIndicator={false}
                onContentSizeChange={(w, h) => {
                    onScrollToEnd();
                    setIsMore(w > globalSize.screenWidth);
                }}
            >
                {data.map(({ id, imageUrl, placeholder, title }) => {
                    return (
                        <Animated.View
                            key={id}
                            entering={ZoomIn}
                            exiting={ZoomOut}
                            style={[globalStyles["flex-center"], { marginRight: 10 }]}
                        >
                            <CircleImage
                                onPress={typeof onPress === "function" ? onPress : () => undefined}
                                id={id}
                                size={40}
                                source={{ uri: imageUrl }}
                                placeholder={placeholder}
                            />
                            <Text style={styles.title as any}>{title}</Text>
                            {typeof removeOnPress === "function" && (
                                <CloseButtonBorder
                                    id={id}
                                    onPress={removeOnPress}
                                    style={styles.closeButton}
                                    size={15}
                                />
                            )}
                        </Animated.View>
                    );
                })}
            </ScrollView>

            {isMore && (
                <Animated.View
                    style={styles.wrapButton}
                    entering={SlideInLeft}
                    exiting={SlideOutLeft}
                >
                    <ArrowLeftButton size={25} onPress={handleArrowLeftOnPress} />
                </Animated.View>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flexDirection: "row",
        marginBottom: 10,
        alignItems: "center"
    },
    title: {
        marginTop: 4,
        fontFamily: "Roboto-Bold",
        fontSize: 12
    },
    closeButton: {
        position: "absolute",
        top: 0,
        right: 10,
        backgroundColor: globalColor.white,
        borderRadius: 10
    },
    wrapButton: {
        position: "absolute",
        justifyContent: "center",
        alignItems: "center"
    }
});

export default AnimatedCircleImagesWrapView;
