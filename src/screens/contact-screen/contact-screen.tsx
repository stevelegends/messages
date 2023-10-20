// react
import React, { FC, useEffect, useMemo, useState } from "react";

// modules
import { ScrollView, TextStyle, View } from "react-native";
import { StackNavigationProp } from "@react-navigation/stack";
import { RouteProp, useTheme } from "@react-navigation/native";
import Animated, { SlideInLeft, ZoomIn, ZoomOut } from "react-native-reanimated";
import { Trans } from "@lingui/macro";

// navigation
import { StackNavigatorParams } from "@navigation/main-navigator";

// styles
import styles from "./contact-screen.styles";

// theme
import { AppColor, AppSize, AppStyle } from "@theme/theme";

// components
import { Text } from "@atoms";
import { CircleImage, ToggleThemeButton } from "@components";
import { ChevronRightButton } from "@molecules";
import ItemListView from "../new-chat-screen/components/item-list-view";

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
    const theme = useTheme();
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

    useEffect(() => {
        getUserChats();
        navigation.setOptions({
            headerRight: props => <ToggleThemeButton />
        });
    }, []);

    return (
        <View style={[styles.container]}>
            <View style={AppStyle["flex-center"]}>
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
                <Text style={{ ...(styles.text as any) }}>
                    {currentUser.firstName} {currentUser.lastName}
                </Text>
                <Text
                    numberOfLines={2}
                    style={{ ...(styles.text2 as any), color: AppColor["dark-grey"] }}
                >
                    {currentUser.about}
                </Text>
            </View>

            {commonChats.length > 0 && (
                <View style={{ marginHorizontal: 12 }}>
                    <Text numberOfLines={2} style={styles.text3 as any}>
                        {commonChats.length}{" "}
                        {commonChats.length === 1 ? (
                            <Trans>Group in Common</Trans>
                        ) : (
                            <Trans>Groups in Common</Trans>
                        )}
                    </Text>

                    <ScrollView>
                        {commonChats.map((value, index) => {
                            const chatId = value;
                            const chatData = chats.chatsData[chatId];
                            return (
                                <Animated.View
                                    key={chatId}
                                    entering={SlideInLeft.delay(index * 300)}
                                    style={[AppStyle["flex-row"], AppStyle["flex-center"]]}
                                >
                                    <ItemListView
                                        id={chatId}
                                        index={index}
                                        title={chatData.chatName}
                                        subTitle={chatData.latestMessageText}
                                        onPress={() => {
                                            navigation.push("ChatScreen", { chatId });
                                        }}
                                    />
                                    <ChevronRightButton
                                        color={AppColor["dark-grey"]}
                                        size={30}
                                        onPress={() => {
                                            navigation.push("ChatScreen", { chatId });
                                        }}
                                    />
                                </Animated.View>
                            );
                        })}
                    </ScrollView>
                </View>
            )}
        </View>
    );
};

export default ContactScreen;
