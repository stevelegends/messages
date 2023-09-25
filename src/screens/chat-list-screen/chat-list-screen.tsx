// react
import React, { FC, useCallback, useEffect } from "react";

// modules
import { StackNavigationProp } from "@react-navigation/stack";
import { Button, View } from "react-native";

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
};

const ChatListScreen: FC<ChatListScreenProps> = ({ navigation }) => {
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
        navigation.setOptions({
            headerRight: () => <CreateButton onPress={() => navigate("NewChatScreen")} />
        });
    }, []);

    return (
        <View style={styles.container}>
            <Button title="Chat" onPress={() => navigate("ChatScreen")} />
        </View>
    );
};

export default ChatListScreen;
