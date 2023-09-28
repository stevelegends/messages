// react
import React, { FC, useCallback, useEffect, useState } from "react";

// modules
import { StackNavigationProp } from "@react-navigation/stack";
import { FlatList, View } from "react-native";
import { FontAwesome } from "@expo/vector-icons";
import { Trans } from "@lingui/macro";

// styles
import styles from "./new-chat-screen.styles";

// navigation
import { StackNavigatorParams } from "@navigation/main-navigator";

// hooks
import { useFirebase, useTabNavigation } from "@hooks/index";
import { useTheme } from "@react-navigation/native";
import { useLingui } from "@lingui/react";

//components
import { CloseButtonText } from "@components";
import AnimatedIndicator from "./components/animated-indicator";
import AnimatedStatusView from "./components/animated-status-view";
import SearchInputView from "./components/search-input-view";
import ItemListView from "./components/item-list-view";
import { globalStyles } from "@theme/theme";

// store
import useAuth from "@store/features/auth/use-auth";
import useUser from "@store/features/user/use-user";

type Props = {
    navigation: StackNavigationProp<StackNavigatorParams, "NewChatScreen">;
};
const NewChatScreen: FC<Props> = ({ navigation }) => {
    const theme = useTheme();
    const { i18n } = useLingui();
    const firebase = useFirebase();
    const auth = useAuth();
    const user = useUser();

    const tabNavigation = useTabNavigation();

    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [users, setUsers] = useState<{ [key: string]: any } | undefined>();
    const [noResultsFound, setNoResultFound] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");

    const isUserData = users && Object.keys(users) && Object.keys(users).length > 0;

    const handleOnChangeText = (text: string) => {
        setSearchTerm(text);
    };

    const handleItemOnPress = useCallback(
        id => {
            if (!users) return;
            tabNavigation.navigate("ChatListScreen", { selectedUserId: id });
        },
        [users]
    ) as (id: string) => void;

    useEffect(() => {
        const delaySearch = setTimeout(async () => {
            if (!searchTerm || (searchTerm && searchTerm.trim() === "")) {
                setUsers(undefined);
                setNoResultFound(false);
                return;
            }

            setIsLoading(true);

            const userData = await firebase.getUserDataByText({ queryText: searchTerm });

            delete userData[auth.userData.userId];

            setUsers(userData || {});

            if (Object.keys(userData || {}).length) {
                user.setStoredUsersOverrideAction(userData);
                setNoResultFound(true);
            } else {
                setNoResultFound(false);
            }

            setIsLoading(false);
        }, 500);

        return () => {
            clearTimeout(delaySearch);
        };
    }, [searchTerm]);

    useEffect(() => {
        navigation.setOptions({
            headerLeft: () => (
                <CloseButtonText onPress={() => navigation.canGoBack() && navigation.goBack()} />
            )
        });
    }, []);

    return (
        <View style={styles.container}>
            <View style={[{ opacity: isUserData ? 0 : 1 }, styles.wrapStatusView]}>
                <AnimatedIndicator visible={isLoading} />
                <AnimatedStatusView
                    visible={!isLoading && noResultsFound}
                    icon={
                        <FontAwesome
                            name="question"
                            size={50}
                            color={theme.colors.border}
                            style={styles.noResultIcon}
                        />
                    }
                    message={<Trans>No users found!</Trans>}
                />
                <AnimatedStatusView
                    visible={!isLoading && !users}
                    icon={
                        <FontAwesome
                            name="users"
                            size={50}
                            color={theme.colors.border}
                            style={styles.noResultIcon}
                        />
                    }
                    message={<Trans>Enter a name to search for a user!</Trans>}
                />
            </View>

            <View style={[globalStyles["marginH-14"], globalStyles["marginV-8"]]}>
                <SearchInputView onChangeText={handleOnChangeText} />
            </View>

            {isUserData && (
                <FlatList
                    data={Object.keys(users)}
                    renderItem={({ item, index }) => {
                        const userId = item;
                        const userData = users[userId];
                        return (
                            <ItemListView
                                id={userId}
                                index={index}
                                title={userData.firstName + " " + userData.lastName}
                                subTitle={userData.about}
                                image={userData.profilePicture}
                                onPress={handleItemOnPress}
                            />
                        );
                    }}
                    keyExtractor={(item, index) => item}
                />
            )}
        </View>
    );
};

export default NewChatScreen;
