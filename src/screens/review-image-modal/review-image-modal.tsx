// react
import React, { FC } from "react";

// modules
import { Image, ScrollView, View } from "react-native";
import { StackNavigationProp } from "@react-navigation/stack";
import { RouteProp, useTheme } from "@react-navigation/native";
import { SafeAreaView } from "react-native-safe-area-context";
import Animated from "react-native-reanimated";

// navigation
import { StackNavigatorParams } from "@navigation/main-navigation";

// styles
import styles from "./review-image-modal.styles";

// theme
import { globalSize, globalStyles } from "@theme/theme";

// components
import { BackButton } from "@components";

type ReviewImageModalProps = {
    navigation: StackNavigationProp<StackNavigatorParams, "ReviewImageModal">;
    route: RouteProp<StackNavigatorParams, "ReviewImageModal">;
};

const ReviewImageModal: FC<ReviewImageModalProps> = props => {
    const uri = props.route.params?.url;

    const theme = useTheme();

    const handleBackOnPress = () => {
        props.navigation.canGoBack() && props.navigation.goBack();
    };

    return (
        <View style={styles.container}>
            <ScrollView contentContainerStyle={styles.container}>
                <Animated.View
                    style={{ height: globalSize.screenHeight, width: globalSize.screenWidth }}
                >
                    <Image source={{ uri }} style={styles.imageView} resizeMode="contain" />
                </Animated.View>
            </ScrollView>
            <SafeAreaView style={{ position: "absolute" }}>
                <BackButton style={styles.backButton} onPress={handleBackOnPress} />
            </SafeAreaView>
        </View>
    );
};

export default ReviewImageModal;
