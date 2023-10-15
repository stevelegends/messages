// react
import React, { FC, Fragment, useCallback, useEffect, useState } from "react";

// modules
import { StackNavigationProp } from "@react-navigation/stack";
import { FlatList, View } from "react-native";
import { FontAwesome } from "@expo/vector-icons";
import { t, Trans } from "@lingui/macro";

// styles
import styles from "./new-chat-screen.styles";

// navigation
import { StackNavigatorParams } from "@navigation/main-navigator";

// hooks
import { useFirebase, useTabNavigation } from "@hooks/index";
import { RouteProp, useTheme } from "@react-navigation/native";
import { useLingui } from "@lingui/react";

//components
import { CloseButtonText } from "@components";
import AnimatedIndicator from "./components/animated-indicator";
import AnimatedStatusView from "./components/animated-status-view";
import SearchInputView from "./components/search-input-view";
import ItemListView from "./components/item-list-view";
import { AnimatedCheckboxButton, CreateButtonText, RegularInputView } from "@molecules";
import { AnimatedCircleImagesWrapView } from "@organisms";

// theme
import { globalStyles } from "@theme/theme";

// store
import useAuth from "@store/features/auth/use-auth";
import useUser from "@store/features/user/use-user";

type Props = {
    navigation: StackNavigationProp<StackNavigatorParams, "NewChatScreen">;
    route: RouteProp<StackNavigatorParams, "NewChatScreen">;
};
const NewChatScreen: FC<Props> = ({ navigation, route }) => {
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

    // group chat
    const [chatName, setChatName] = useState("");
    const [selectedUsers, setSelectedUsers] = useState<Array<string>>([]);

    const isUserData = users && Object.keys(users) && Object.keys(users).length > 0;

    const isGroupChat = route.params?.isGroupChat;
    const isGroupChatDisabled = selectedUsers.length === 0 || chatName === "";

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

    const handleSelectedUserOnPress = useCallback((isChecked, id) => {
        if (id) {
            setSelectedUsers(prevState => {
                if (prevState.includes(id)) {
                    return prevState.filter(value => value !== id);
                } else {
                    return prevState.concat(id);
                }
            });
        }
    }, []) as (isChecked: boolean, id?: string) => void;

    const handleRemoveSelectedUserOnPress = useCallback(id => {
        if (id) {
            setSelectedUsers(prevState => prevState.filter(value => value !== id));
        }
    }, []) as (id?: string) => void;

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
                setNoResultFound(false);
            } else {
                setNoResultFound(true);
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
            ),
            title: isGroupChat ? t(i18n)`Add participants` : t(i18n)`New chat`,
            headerRight: () =>
                isGroupChat ? (
                    <CreateButtonText
                        disabled={isGroupChatDisabled}
                        onPress={() => {
                            tabNavigation.navigate("ChatListScreen", {
                                selectedUsers,
                                chatName
                            });
                        }}
                    />
                ) : null
        });
    }, [chatName, selectedUsers]);

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
                {isGroupChat && (
                    <Fragment>
                        <RegularInputView
                            value={chatName}
                            onChangeText={setChatName}
                            onClearText={setChatName}
                            placeholder={t(i18n)`Enter a name for your chat`}
                        />
                        <AnimatedCircleImagesWrapView
                            data={selectedUsers.map(id => {
                                const selectedUser = user.storedUsers[id];
                                return {
                                    id,
                                    imageUrl: selectedUser.profilePicture,
                                    placeholder: selectedUser.firstLast?.[0]?.toUpperCase(),
                                    title: selectedUser.firstLast
                                };
                            })}
                            removeOnPress={handleRemoveSelectedUserOnPress}
                        />
                    </Fragment>
                )}

                <SearchInputView onChangeText={handleOnChangeText} />
            </View>

            {isUserData && (
                <FlatList
                    data={Object.keys(users)}
                    renderItem={({ item, index }) => {
                        const userId = item;
                        const userData = users[userId];
                        return (
                            <View
                                style={[
                                    globalStyles["flex-row"],
                                    globalStyles["horizontal-center"],
                                    globalStyles["flex-1"]
                                ]}
                            >
                                {isGroupChat && (
                                    <AnimatedCheckboxButton
                                        id={userId}
                                        style={styles.checkbox}
                                        onPress={handleSelectedUserOnPress}
                                        isChecked={selectedUsers.includes(userId)}
                                    />
                                )}
                                <ItemListView
                                    id={userId}
                                    index={index}
                                    title={userData.firstName + " " + userData.lastName}
                                    subTitle={userData.about}
                                    image={userData.profilePicture}
                                    onPress={isGroupChat ? () => undefined : handleItemOnPress}
                                />
                            </View>
                        );
                    }}
                    keyExtractor={(item, index) => item}
                />
            )}
        </View>
    );
};

export default NewChatScreen;
