// react
import React, { FC, useCallback, useEffect, useMemo, useState } from "react";

// modules
import {
    FlatList,
    KeyboardAvoidingView,
    NativeScrollEvent,
    NativeSyntheticEvent,
    Platform,
    TextInput,
    TouchableOpacity,
    View
} from "react-native";
import { StackNavigationProp } from "@react-navigation/stack";
import { SafeAreaView } from "react-native-safe-area-context";
import { Feather } from "@expo/vector-icons";
import Animated, { useSharedValue, ZoomIn, ZoomOut } from "react-native-reanimated";
import { i18n } from "@lingui/core";
import { msg } from "@lingui/macro";

// navigation
import { StackNavigatorParams } from "@navigation/main-navigator";

// styles
import styles from "./chat-screen.styles";

// theme
import { globalStyles } from "@theme/theme";

// components
import { BackButton, CircleImage, Text, ToggleThemeButton } from "@components";
import BubbleView from "./components/bubble-view";

// hooks
import { RouteProp, useTheme } from "@react-navigation/native";
import { useFirebase } from "@hooks/index";
import { useNotificationProvider } from "@contexts/notification-context";

// store
import useUser from "@store/features/user/use-user";
import useAuth from "@store/features/auth/use-auth";
import useChats from "@store/features/chats/use-chats";
import useMessages from "@store/features/messages/use-messages";

// utils
import { ErrorMessage } from "@utils";

// constants
import { UserStatus } from "@constants/user-status";

type ChatScreenProps = {
    navigation: StackNavigationProp<StackNavigatorParams, "ChatScreen">;
    route: RouteProp<StackNavigatorParams, "ChatScreen">;
};

const ChatScreen: FC<ChatScreenProps> = ({ navigation, route }) => {
    const theme = useTheme();
    const firebase = useFirebase();
    const auth = useAuth();
    const user = useUser();
    const chats = useChats();
    const notification = useNotificationProvider();
    const messages = useMessages();

    const [chatId, setChatId] = useState<string | undefined>(route.params?.chatId);

    const [messageText, setMessageText] = useState<string>("");

    const chatData =
        (route.params?.chatId && chats.chatsData[route.params.chatId]) || route.params?.newChatData;

    const chatMessages = useMemo(() => {
        if (!chatId || !messages.messagesData) return [];
        const messagesData = messages.messagesData[chatId] || {};
        return Object.keys(messagesData).map(key => ({ key, ...messagesData[key] }));
    }, [chatId, messages.messagesData]);

    const animatedScrollY = useSharedValue<number>(0);

    const sendMessageOnPress = useCallback(async () => {
        if (!auth.userData?.userId) return;
        if (!chatData) return;

        let uniqChatId = chatId;

        if (!chatId) {
            /** no chat id, create new */
            uniqChatId = await firebase.onCreateChatAsync(auth.userData.userId, chatData);
            setChatId(uniqChatId);
        }

        if (uniqChatId) {
            await firebase.onSendMessageTextAsync(uniqChatId, auth.userData.userId, messageText);
        } else {
            notification.addStack({
                title: i18n._(ErrorMessage.default),
                message: i18n._(ErrorMessage["send-message-failed"]),
                status: "error"
            });
        }

        setMessageText("");
    }, [messageText, chatId, auth.userData?.userId, chatData]);

    const onScroll = useCallback(event => {
        const y = event.nativeEvent.contentOffset.y;
        animatedScrollY.value = y;
    }, []) as (event: NativeSyntheticEvent<NativeScrollEvent>) => void;

    const handleStartActionOnPress = useCallback(
        (messageId: string) => {
            if (messageId && chatId && auth.userData?.userId) {
                firebase.onStarMessageAsync(auth.userData.userId, chatId, messageId);
            }
        },
        [auth.userData?.userId, chatId]
    );

    useEffect(() => {
        function getChatUser(): { name: string; picture: string; status: UserStatus } {
            const chatUsers = chatData?.users;
            if (Array.isArray(chatUsers)) {
                const otherUserId = chatUsers.find(uid => uid !== auth.userData.userId);
                if (otherUserId) {
                    const otherUserData = user.storedUsers[otherUserId];
                    const statuses = Object.values(otherUserData.session).map(
                        ss => (ss as any).status
                    );
                    const status = statuses.includes(UserStatus.active)
                        ? UserStatus.active
                        : UserStatus.inactive;
                    return {
                        name: `${otherUserData.firstName} ${otherUserData.lastName}`,
                        picture: otherUserData.profilePicture,
                        status
                    };
                }
            }
            return { name: "", picture: "", status: UserStatus.inactive };
        }

        function onHandleSetNavigationOptions() {
            const { name, picture, status } = getChatUser();
            navigation.setOptions({
                header: props => (
                    <SafeAreaView
                        edges={["top", "left", "right"]}
                        style={[{ backgroundColor: theme.colors.card }]}
                    >
                        <View
                            style={[
                                globalStyles["flex-row"],
                                globalStyles["flex-center"],
                                globalStyles["space-between"]
                            ]}
                        >
                            <BackButton onPress={props.navigation.goBack} />
                            <View
                                style={[globalStyles["flex-center"], globalStyles["paddingV-10"]]}
                            >
                                <CircleImage
                                    cached
                                    size={50}
                                    source={{ uri: picture }}
                                    status={status}
                                    placeholder={name[0].toUpperCase()}
                                />
                                <Text style={{ fontSize: 12 }}>{name}</Text>
                            </View>

                            <ToggleThemeButton />
                        </View>
                    </SafeAreaView>
                )
            });
        }

        onHandleSetNavigationOptions();
        return () => {};
    }, [theme.dark]);

    return (
        <SafeAreaView edges={["left", "right", "bottom"]} style={styles.container}>
            <KeyboardAvoidingView
                behavior={Platform.select({ ios: "padding" })}
                keyboardVerticalOffset={140}
                style={globalStyles["flex-1"]}
            >
                {/*<ImageBackground source={images.droplet} style={globalStyles["flex-1"]}>*/}
                <View style={[globalStyles["flex-1"]]}>
                    <FlatList
                        data={chatMessages}
                        renderItem={({ item, index }) => {
                            const isOwnMessage = item.sentBy === auth.userData.userId;
                            const type = isOwnMessage ? "owner" : "their";
                            return (
                                <BubbleView
                                    index={index}
                                    id={item.key}
                                    text={item.text}
                                    type={type}
                                    time={item.sentAt}
                                    animatedScrollY={animatedScrollY}
                                    startActionOnPress={handleStartActionOnPress}
                                />
                            );
                        }}
                        onScroll={onScroll}
                        keyExtractor={(item, index) => item.key || index.toString()}
                        ListHeaderComponent={<View style={styles.separatorChatList} />}
                        ItemSeparatorComponent={(<View style={styles.separatorChatList} />) as any}
                        showsVerticalScrollIndicator={false}
                    />
                </View>
                {/*</ImageBackground>*/}
                <View style={[styles.inputContainer, { backgroundColor: theme.colors.border }]}>
                    <TouchableOpacity style={styles.mediaButton}>
                        <Feather name="plus" size={24} color={theme.colors.primary} />
                    </TouchableOpacity>

                    <TextInput
                        style={[
                            styles.textBox,
                            { color: theme.colors.text, borderColor: theme.colors.border }
                        ]}
                        value={messageText}
                        onChangeText={setMessageText}
                        onSubmitEditing={sendMessageOnPress}
                        autoCapitalize="none"
                        multiline
                        placeholder={i18n._(msg`Type your message...`)}
                        placeholderTextColor={theme.colors.text}
                        maxLength={1000}
                        autoFocus={false}
                    />

                    {messageText.trim().length === 0 && (
                        <Animated.View
                            entering={ZoomIn}
                            exiting={ZoomOut}
                            style={styles.mediaButton}
                        >
                            <TouchableOpacity style={globalStyles["flex-center"]}>
                                <Feather name="camera" size={24} color={theme.colors.primary} />
                            </TouchableOpacity>
                        </Animated.View>
                    )}
                    {messageText.trim().length !== 0 && (
                        <Animated.View
                            entering={ZoomIn}
                            exiting={ZoomOut}
                            style={globalStyles["flex-center"]}
                        >
                            <TouchableOpacity
                                onPress={sendMessageOnPress}
                                style={[
                                    { backgroundColor: theme.colors.primary },
                                    styles.sendButton
                                ]}
                            >
                                <Feather name="send" size={15} color={theme.colors.background} />
                            </TouchableOpacity>
                        </Animated.View>
                    )}
                </View>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
};

export default ChatScreen;
