// react
import React, { FC, useEffect, useState } from "react";

// modules
import { StackNavigationProp } from "@react-navigation/stack";
import { TextInput, View } from "react-native";
import { Feather, FontAwesome } from "@expo/vector-icons";
import { t, Trans } from "@lingui/macro";
import Animated, { ZoomIn, ZoomOut } from "react-native-reanimated";

// styles
import styles from "./new-chat-screen.styles";

// navigation
import { StackNavigatorParams } from "@navigation/main-navigation";

// hooks
import { useNavigation } from "@hooks/index";
import { useTheme } from "@react-navigation/native";
import { useLingui } from "@lingui/react";

//components
import { CloseButtonText, Text } from "@components";
import { globalStyles } from "@theme/theme";

type Props = {
    navigation: StackNavigationProp<StackNavigatorParams, "NewChatScreen">;
};
const NewChatScreen: FC<Props> = ({ navigation }) => {
    const theme = useTheme();
    const { i18n } = useLingui();

    const { navigate, canGoBack, goBack } = useNavigation();

    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [users, setUsers] = useState();
    const [noResultsFound, setNoResultFound] = useState(false);

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
                <Feather name="search" size={15} color={theme.colors.text} />
                <TextInput
                    placeholder={t(i18n)`Search`}
                    style={[styles.searchBox, { color: theme.colors.text }]}
                    onChangeText={() => {}}
                />
            </View>

            {!isLoading && noResultsFound && (
                <Animated.View
                    entering={ZoomIn}
                    exiting={ZoomOut}
                    style={[globalStyles["flex-1-center"]]}
                >
                    <FontAwesome
                        name="question"
                        size={50}
                        color={theme.colors.text}
                        style={styles.noResultIcon}
                    />
                    <Text style={styles.noResultText}>
                        <Trans>No users found!</Trans>
                    </Text>
                </Animated.View>
            )}

            {!isLoading && !users && (
                <Animated.View
                    entering={ZoomIn.delay(100)}
                    exiting={ZoomOut}
                    style={[globalStyles["flex-1-center"]]}
                >
                    <FontAwesome
                        name="users"
                        size={50}
                        color={theme.colors.text}
                        style={styles.noResultIcon}
                    />
                    <Text style={styles.noResultText}>
                        <Trans>Enter a name to search for a user!</Trans>
                    </Text>
                </Animated.View>
            )}
        </View>
    );
};

export default NewChatScreen;
