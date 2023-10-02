// react
import React, { FC, useCallback, useEffect, useState } from "react";

// modules
import {
    ImageBackground,
    KeyboardAvoidingView,
    Platform,
    TextInput,
    TouchableOpacity,
    View
} from "react-native";
import { StackNavigationProp } from "@react-navigation/stack";
import { SafeAreaView } from "react-native-safe-area-context";
import { Feather } from "@expo/vector-icons";
import Animated, { FadeIn, FadeOut } from "react-native-reanimated";

// navigation
import { StackNavigatorParams } from "@navigation/main-navigator";

// styles
import styles from "./chat-screen.styles";

// theme
import { globalStyles } from "@theme/theme";
import { images } from "@theme/images";

// components
import { ToggleThemeButton } from "@components";
import BubbleView from "./components/bubble-view";

// hooks
import { RouteProp, useTheme } from "@react-navigation/native";
import { useFirebase } from "@hooks/index";

// store
import useUser from "@store/features/user/use-user";
import useAuth from "@store/features/auth/use-auth";
import useChats from "@store/features/chats/use-chats";
import useMessages from "@store/features/messages/use-messages";

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
    const messages = useMessages();

    const [chatId, setChatId] = useState<string | undefined>(route.params?.chatId);

    const [messageText, setMessageText] = useState<string>("");

    const chatData =
        (route.params?.chatId && chats.chatsData[route.params.chatId]) || route.params?.newChatData;

    const sendMessageOnPress = useCallback(async () => {
        if (!auth.userData?.userId) return;
        if (!chatData) return;

        if (chatId) {
            await firebase.onSendMessageTextAsync(chatId, auth.userData.userId, messageText);
        } else {
            /** no chat id, create new */
            const newChatId = await firebase.onCreateChatAsync(auth.userData.userId, chatData);
            setChatId(newChatId);
        }

        setMessageText("");
    }, [messageText, chatId, auth.userData?.userId, chatData]);

    useEffect(() => {
        function getChatTitleFromName() {
            const chatUsers = chatData?.users;
            if (Array.isArray(chatUsers)) {
                const otherUserId = chatUsers.find(uid => uid !== auth.userData.userId);
                if (otherUserId) {
                    const otherUserData = user.storedUsers[otherUserId];
                    return `${otherUserData.firstName} ${otherUserData.lastName}`;
                }
            }
        }

        function onHandleSetNavigationOptions() {
            const title = getChatTitleFromName();
            navigation.setOptions({
                headerTitle: title,
                headerRight: () => <ToggleThemeButton />
            });
        }

        onHandleSetNavigationOptions();
        return () => {};
    }, []);

    return (
        <SafeAreaView edges={["left", "right", "bottom"]} style={styles.container}>
            <KeyboardAvoidingView
                behavior={Platform.select({ ios: "padding" })}
                keyboardVerticalOffset={100}
                style={globalStyles["flex-1"]}
            >
                <ImageBackground source={images.droplet} style={globalStyles["flex-1"]}>
                    <View style={[globalStyles["flex-1"]]}>
                        {!chatId && <BubbleView text="This is new chat" />}
                    </View>
                </ImageBackground>
                <View style={styles.inputContainer}>
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
                    />
                    {messageText.trim().length === 0 ? (
                        <Animated.View
                            entering={FadeIn}
                            exiting={FadeOut}
                            style={styles.mediaButton}
                        >
                            <TouchableOpacity style={globalStyles["flex-center"]}>
                                <Feather name="camera" size={24} color={theme.colors.primary} />
                            </TouchableOpacity>
                        </Animated.View>
                    ) : (
                        <Animated.View
                            entering={FadeIn}
                            exiting={FadeOut}
                            style={globalStyles["flex-center"]}
                        >
                            <TouchableOpacity
                                onPress={sendMessageOnPress}
                                style={[
                                    globalStyles["flex-center"],
                                    { backgroundColor: theme.colors.primary },
                                    styles.sendButton
                                ]}
                            >
                                <Feather name="send" size={20} color={theme.colors.background} />
                            </TouchableOpacity>
                        </Animated.View>
                    )}
                </View>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
};

export default ChatScreen;
