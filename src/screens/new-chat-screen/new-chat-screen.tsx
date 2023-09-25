// react
import React, { FC, useEffect, useState } from "react";

// modules
import { StackNavigationProp } from "@react-navigation/stack";
import { TextInput, View } from "react-native";
import { Feather, FontAwesome } from "@expo/vector-icons";
import { t, Trans } from "@lingui/macro";
import Animated, { FadeIn, FadeOut, ZoomIn, ZoomOut } from "react-native-reanimated";

// styles
import styles from "./new-chat-screen.styles";

// navigation
import { StackNavigatorParams } from "@navigation/main-navigation";

// hooks
import { useFirebase, useNavigation } from "@hooks/index";
import { useTheme } from "@react-navigation/native";
import { useLingui } from "@lingui/react";

//components
import { CloseButtonText, Text } from "@components";

// theme
import { globalStyles } from "@theme/theme";

type Props = {
    navigation: StackNavigationProp<StackNavigatorParams, "NewChatScreen">;
};
const NewChatScreen: FC<Props> = ({ navigation }) => {
    const theme = useTheme();
    const { i18n } = useLingui();
    const firebase = useFirebase();

    const { navigate, canGoBack, goBack } = useNavigation();

    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [users, setUsers] = useState<any[] | undefined>();
    const [noResultsFound, setNoResultFound] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");

    const handleOnChangeText = (text: string) => {
        setSearchTerm(text);
    };

    useEffect(() => {
        const delaySearch = setTimeout(async () => {
            if (!searchTerm || (searchTerm && searchTerm.trim() === "")) {
                setUsers(undefined);
                setNoResultFound(false);
                return;
            }

            setIsLoading(true);

            const data = await firebase.getUserDataByText({ queryText: searchTerm });
            console.log(data);

            setIsLoading(false);
        }, 500);

        return () => {
            clearTimeout(delaySearch);
        };
    }, [searchTerm]);

    useEffect(() => {
        navigation.setOptions({
            headerLeft: () => <CloseButtonText onPress={() => canGoBack() && goBack()} />
        });
    }, []);

    return (
        <View style={styles.container}>
            <View
                style={[
                    styles.searchContainer,
                    globalStyles["marginH-8"],
                    { backgroundColor: theme.colors.border }
                ]}
            >
                <Feather name="search" size={20} color={theme.colors.text} />
                <TextInput
                    placeholder={t(i18n)`Search`}
                    placeholderTextColor={theme.colors.text}
                    style={[styles.searchBox, { color: theme.colors.text }]}
                    onChangeText={handleOnChangeText}
                    maxLength={50}
                    numberOfLines={1}
                />
            </View>

            {!isLoading && noResultsFound && (
                <View style={[globalStyles["flex-1-center"]]}>
                    <Animated.View entering={ZoomIn} exiting={ZoomOut}>
                        <FontAwesome
                            name="question"
                            size={50}
                            color={theme.colors.border}
                            style={styles.noResultIcon}
                        />
                    </Animated.View>
                    <Animated.View entering={FadeIn} exiting={FadeOut}>
                        <Text style={styles.noResultText}>
                            <Trans>No users found!</Trans>
                        </Text>
                    </Animated.View>
                </View>
            )}

            {!isLoading && !users && (
                <Animated.View style={[globalStyles["flex-1-center"]]}>
                    <Animated.View entering={ZoomIn} exiting={ZoomOut}>
                        <FontAwesome
                            name="users"
                            size={50}
                            color={theme.colors.border}
                            style={styles.noResultIcon}
                        />
                    </Animated.View>
                    <Animated.View entering={FadeIn} exiting={FadeOut}>
                        <Text style={styles.noResultText}>
                            <Trans>Enter a name to search for a user!</Trans>
                        </Text>
                    </Animated.View>
                </Animated.View>
            )}
        </View>
    );
};

export default NewChatScreen;
