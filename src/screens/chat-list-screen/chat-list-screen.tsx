// react
import React, { FC, useCallback, useEffect, useMemo } from "react";

// modules
import { StackNavigationProp } from "@react-navigation/stack";
import { View } from "react-native";
import { RouteProp } from "@react-navigation/native";

// styles
import styles from "./chat-list-screen.styles";

// navigation
import { BottomTabStackNavigatorParams } from "@navigation/bottom-tab-navigation";

// components
import { CreateButton } from "@components";

// hooks
import { useFirebase, useNavigation, useUserState } from "@hooks/index";

// constants
import { UserStatus } from "@constants/user-status";

// store
import useAuth from "@store/features/auth/use-auth";

type ChatListScreenProps = {
    navigation: StackNavigationProp<BottomTabStackNavigatorParams, "ChatListScreen">;
    route: RouteProp<BottomTabStackNavigatorParams, "ChatListScreen">;
};

const ChatListScreen: FC<ChatListScreenProps> = ({ navigation, route }) => {
    const { navigate } = useNavigation();
    const firebase = useFirebase();
    const auth = useAuth();

    const onUserStatus = useCallback((status, deps) => {
        if (!deps) return;
        __DEV__ && console.log("onUserStatus", status, deps);
        const userId = deps.userId as string;
        const session = deps.session || {};
        firebase.onUpdateSignedInUserStatusData({ userId, status, session }, undefined);
        auth.setStatusAction({ status });
    }, []) as (status: UserStatus, deps: any) => any;

    useUserState(onUserStatus, auth.userData);

    useEffect(() => {
        function handleSelectedUserFromNewChatScreen() {
            if (!route.params?.selectedUserId) return;

            navigation.setParams({ selectedUserId: undefined });

            const props = {
                newChatData: {
                    users: [route.params?.selectedUserId, auth.userData.userId]
                }
            };
            navigate("ChatScreen", props);
        }
        handleSelectedUserFromNewChatScreen();
    }, [route.params?.selectedUserId]);

    useEffect(() => {
        navigation.setOptions({
            headerRight: () => <CreateButton onPress={() => navigate("NewChatScreen")} />
        });
    }, []);

    return <View style={styles.container}></View>;
};

export default ChatListScreen;
