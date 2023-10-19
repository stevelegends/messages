// react
import React, { FC, useEffect, useMemo, useState } from "react";

// modules
import { TextStyle, View } from "react-native";
import { StackNavigationProp } from "@react-navigation/stack";
import { RouteProp } from "@react-navigation/native";
import Animated, { ZoomIn, ZoomOut } from "react-native-reanimated";

// navigation
import { StackNavigatorParams } from "@navigation/main-navigator";

// styles
import styles from "./contact-screen.styles";

// theme
import { AppColor, AppSize, AppStyle } from "@theme/theme";

// components
import { Text } from "@atoms";
import { CircleImage } from "@components";

// store
import useUser from "@store/features/user/use-user";
import useChats from "@store/features/chats/use-chats";

// hooks
import { useFirebase } from "@hooks/index";

type ContactScreenProps = {
    navigation: StackNavigationProp<StackNavigatorParams, "ContactScreen">;
    route: RouteProp<StackNavigatorParams, "ContactScreen">;
};

const ImageSize = AppSize.screenWidth / 4;

const ContactScreen: FC<ContactScreenProps> = ({ navigation, route }) => {
    const uid = route.params?.uid;
    const user = useUser();
    const chats = useChats();
    const firebase = useFirebase();

    const currentUser = uid ? user.storedUsers[uid] : {};

    const [commonChats, setCommonChats] = useState<Array<any>>([]);

    const placeholderStyle = useMemo(() => {
        return { fontSize: 40 };
    }, []) as TextStyle;

    async function getUserChats() {
        if (!currentUser) return;

        const currentUserChats = await firebase.getUserChatsDataAsync({
            userId: currentUser.userId
        });
        const getCommonChats = (Object.values(currentUserChats) as Array<string>).filter(
            value => chats.chatsData[value] && chats.chatsData[value].isGroupChat
        );
        setCommonChats(getCommonChats);
    }

    console.log("commonChats", commonChats);
    useEffect(() => {
        getUserChats();
    }, []);

    return (
        <View style={[styles.container, AppStyle["flex-center"]]}>
            <Animated.View
                entering={ZoomIn.delay(100)}
                exiting={ZoomOut}
                style={AppStyle["marginT-20"]}
            >
                <CircleImage
                    size={ImageSize}
                    source={{ uri: currentUser.profilePicture }}
                    loading={false}
                    cached
                    placeholder={currentUser.firstName?.[0]?.toUpperCase()}
                    placeholderStyle={placeholderStyle}
                    onPress={() => {}}
                />
            </Animated.View>
            <Text style={styles.text as any}>
                {currentUser.firstName} {currentUser.lastName}
            </Text>
            <Text
                numberOfLines={2}
                style={{ ...(styles.text2 as any), color: AppColor["dark-grey"] }}
            >
                {currentUser.about}
            </Text>
        </View>
    );
};

export default ContactScreen;
