// react
import React, { FC } from "react";

// modules
import { ActivityIndicator, ScrollView, StyleSheet, View } from "react-native";
import { StackNavigationProp } from "@react-navigation/stack";
import { RouteProp, useTheme } from "@react-navigation/native";
import { SafeAreaView } from "react-native-safe-area-context";
import Animated from "react-native-reanimated";

// navigation
import { StackNavigatorParams } from "@navigation/main-navigator";

// styles
import styles from "./review-image-modal.styles";

// theme
import { AppColor, AppSize } from "@theme/theme";

// components
import { CloseButton, CachedImageV2 } from "@components";

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
        <View style={[styles.container, { backgroundColor: AppColor["black-0.9"] }]}>
            <ScrollView contentContainerStyle={styles.container}>
                <Animated.View style={{ height: AppSize.screenHeight, width: AppSize.screenWidth }}>
                    <ActivityIndicator color={AppColor.white} style={StyleSheet.absoluteFill} />
                    <CachedImageV2 source={{ uri }} style={styles.imageView} resizeMode="contain" />
                </Animated.View>
            </ScrollView>
            <SafeAreaView style={styles.buttonWrap}>
                <CloseButton style={styles.closeButton} onPress={handleBackOnPress} />
            </SafeAreaView>
        </View>
    );
};

export default ReviewImageModal;
