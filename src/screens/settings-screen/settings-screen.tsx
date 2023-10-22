// react
import React, { FC, useCallback, useEffect, useMemo, useState } from "react";

// modules
import { Pressable, TextStyle, View, ViewStyle } from "react-native";
import { StackNavigationProp } from "@react-navigation/stack";
import { RouteProp, useTheme } from "@react-navigation/native";
import { FontAwesome } from "@expo/vector-icons";
import { msg, t, Trans } from "@lingui/macro";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { i18n } from "@lingui/core";

// styles
import styles from "./settings-screen.styles";

// theme
import { AppSize, AppStyle } from "@theme/theme";

// components
import { Text } from "@atoms";
import { CircleImage, Input } from "@components";
import { SaveButtonText } from "@molecules";

// navigation
import { StackNavigatorParams } from "@navigation/main-navigator";

// store
import useChats from "@store/features/chats/use-chats";
import useAuth from "@store/features/auth/use-auth";

// hooks
import { useImageSize } from "@hooks/index";
import useFirebase from "@hooks/use-firebase";
import { useForm } from "react-hook-form";

// utils
import { ErrorHandler, onLaunchImageLibraryAsync } from "@utils";

type SettingsScreenProps = {
    navigation: StackNavigationProp<StackNavigatorParams, "SettingsScreen">;
    route: RouteProp<StackNavigatorParams, "SettingsScreen">;
};

const ImageSize = AppSize.screenWidth / 4;

type FormData = {
    chatName?: string;
};

const schema = yup
    .object({
        chatName: yup
            .string()
            .matches(/^[A-Za-z 0-9]*$/, i18n._(msg`Please enter valid chat name`))
            .max(40, i18n._(msg`Chat name must be at most 40 characters`))
            .required(i18n._(msg`Chat name is a required`))
    })
    .required();

const SettingsScreen: FC<SettingsScreenProps> = ({ navigation, route }) => {
    const theme = useTheme();
    const chats = useChats();
    const imageSize = useImageSize();
    const firebase = useFirebase();
    const auth = useAuth();

    const userId = route.params?.userId;
    const chatId = route.params?.chatId;
    const chatData = chatId ? chats.chatsData[chatId] : {};

    const [uri, setUri] = useState<string>(chatData?.chatImage);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [isSaveLoading, setSaveIsLoading] = useState<boolean>(false);
    const [disabled, setDisabled] = useState<boolean>(true);

    const {
        control,
        handleSubmit,
        formState: { errors },
        watch,
        setValue
    } = useForm<FormData>({
        resolver: yupResolver<FormData>(schema),
        defaultValues: {
            chatName: chatData.chatName
        }
    });

    const handleImageOnPress = useCallback(async () => {
        setIsLoading(true);

        try {
            const result = await onLaunchImageLibraryAsync("photo", true, false, true);
            if (result.canceled) {
                setIsLoading(false);
                return;
            }

            const assetUri = result.assets[0].uri;
            if (assetUri) {
                // setUri(assetUri)
                const optimizedSize = await imageSize.getImageOptimizedSize(assetUri);
                firebase.onUploadImageAsync(
                    assetUri,
                    setIsLoading,
                    payload => {
                        if (!chatId || !userId) return;

                        setUri(payload.url);
                        firebase.onUpdateChatDataAsync({
                            userId,
                            chatId,
                            chatData: {
                                chatImage: payload.url
                            }
                        });
                    },
                    "chatImages",
                    optimizedSize.size
                );

                return;
            }
        } catch (e) {
            ErrorHandler(e, "handleImageOnPress", true);
        }

        setIsLoading(false);
    }, [auth.userData, chatId, userId]) as () => void;

    const placeholderStyle = useMemo(() => {
        return { fontSize: 40 };
    }, []) as TextStyle;

    const onSubmit = async (data: FormData) => {
        if (!chatId || !userId) return;

        setSaveIsLoading(true);
        await firebase.onUpdateChatDataAsync({ chatId, userId, chatData: data });
        setSaveIsLoading(false);

        chatData.chatName = data.chatName;
        setDisabled(true);
    };

    useEffect(() => {
        if (chatData) {
            const subscription = watch((value, { name, type }) => {
                if (type === "change" && name) {
                    const isChanged = chatData[name]?.trim() === value[name]?.trim();
                    setDisabled(isChanged);
                }
            });
            return () => subscription.unsubscribe();
        }
    }, [watch, chatData]);

    useEffect(() => {
        navigation.setOptions({
            headerRight: () => (
                <SaveButtonText
                    onPress={handleSubmit(onSubmit)}
                    disabled={disabled || isSaveLoading}
                    isLoading={isSaveLoading}
                />
            )
        });
    }, [disabled, isSaveLoading]);

    return (
        <View style={[styles.container, AppStyle["paddingH-20"], AppStyle["marginT-50"]]}>
            <View>
                <CircleImage
                    size={ImageSize}
                    onPress={handleImageOnPress}
                    source={{ uri }}
                    loading={isLoading}
                    cached
                    placeholder={chatData.chatName?.[0]?.toUpperCase()}
                    placeholderStyle={placeholderStyle}
                />
                <Pressable
                    style={[
                        styles.editViewStyle,
                        {
                            left: ImageSize / 2 + 20,
                            backgroundColor: theme.colors.background,
                            borderColor: theme.colors.text
                        }
                    ]}
                    onPress={handleImageOnPress}
                >
                    <FontAwesome name="pencil" size={15} color={theme.colors.text} />
                </Pressable>
            </View>
            <Input
                label={<Trans>Group name</Trans>}
                iconPack={FontAwesome}
                icon="user-o"
                iconSize={15}
                autoCapitalize="none"
                control={control}
                name="chatName"
                errorText={errors.chatName?.message}
            />
        </View>
    );
};

export default SettingsScreen;
