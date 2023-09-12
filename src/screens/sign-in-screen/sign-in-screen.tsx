// react
import React, { FC } from "react";

// modules
import { StackNavigationProp } from "@react-navigation/stack";
import { Feather } from "@expo/vector-icons";

// navigation
import { AuthStackNavigatorParams } from "@navigation/auth-navigation";

// styles
import styles from "./sign-in-screen.styles";

// components
import { Input, PageContainer, SubmitButton } from "@components";

// theme
import { globalStyles } from "@theme/theme";

// hooks
import { useTheme } from "@react-navigation/native";

type SignInScreenProps = {
    navigation: StackNavigationProp<AuthStackNavigatorParams, "SignInScreen">;
};

const SignInScreen: FC<SignInScreenProps> = ({ navigation }) => {
    const theme = useTheme();
    return (
        <PageContainer>
            <Input label="Email" iconPack={Feather} icon="mail" iconSize={20} />
            <Input label="Password" iconPack={Feather} icon="lock" iconSize={20} secureTextEntry />
            <SubmitButton style={globalStyles["marginT-20"]} title="Sign in" />
            <SubmitButton
                style={{ ...globalStyles["marginT-5"], backgroundColor: theme.colors.background }}
                titleStyle={{ color: theme.colors.primary }}
                title="Sign Up"
                onPress={() => {
                    navigation.navigate("SignUpScreen");
                }}
            />
        </PageContainer>
    );
};

export default SignInScreen;
