// react
import React, { FC, useCallback } from "react";

// modules
import { StackNavigationProp } from "@react-navigation/stack";
import { Button, View } from "react-native";

// styles
import styles from "./chat-list-screen.styles";

// navigation
import { BottomTabStackNavigatorParams } from "@navigation/bottom-tab-navigation";

// components
import { Text } from "@components";

// hooks
import { useFirebase, useNavigation, useUserState } from "@hooks/index";

// constants
import { UserStatus } from "@constants/user-status";

// store
import useAuth from "@store/features/auth/use-auth";

type ChatListScreenProps = {
    navigation: StackNavigationProp<BottomTabStackNavigatorParams, "ChatListScreen">;
};

const ChatListScreen: FC<ChatListScreenProps> = () => {
    const { navigate } = useNavigation();
    const firebase = useFirebase();
    const auth = useAuth();

    const onUserStatus = useCallback((status, deps) => {
        __DEV__ && console.log("onUserStatus", status, deps);
        const userId = deps as string;
        firebase.onUpdateSignedInUserStatusData({ userId, status }, payload => {
            auth.setStatusAction({ status: payload.status });
        });
    }, []) as (status: UserStatus, deps: any) => any;

    useUserState(onUserStatus, auth.userData?.userId);

    return (
        <View style={styles.container}>
            <Button title="Chat" onPress={() => navigate("ChatScreen")} />
        </View>
    );
};

export default ChatListScreen;
