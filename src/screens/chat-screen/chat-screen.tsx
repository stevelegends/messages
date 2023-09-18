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
import { StackNavigatorParams } from "@navigation/main-navigation";

// styles
import styles from "./chat-screen.styles";

// theme
import { globalStyles } from "@theme/theme";

// components
import { images } from "@theme/images";

// hooks
import { useTheme } from "@react-navigation/native";

type ChatScreenProps = {
    navigation: StackNavigationProp<StackNavigatorParams, "ChatScreen">;
};

const ChatScreen: FC<ChatScreenProps> = () => {
    const theme = useTheme();

    const [messageText, setMessageText] = useState<string>("");

    const sendMessageOnPress = useCallback(() => {
        setMessageText("");
    }, [messageText]);

    useEffect(() => {}, []);

    return (
        <SafeAreaView edges={["left", "right", "bottom"]} style={styles.container}>
            <KeyboardAvoidingView
                behavior={Platform.select({ ios: "padding" })}
                keyboardVerticalOffset={100}
                style={globalStyles["flex-1"]}
            >
                <ImageBackground
                    source={images.droplet}
                    style={globalStyles["flex-1"]}
                ></ImageBackground>
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
