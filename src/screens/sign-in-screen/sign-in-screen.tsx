// react
import React, { FC } from "react";

// modules
import { StackNavigationProp } from "@react-navigation/stack";
import { Feather } from "@expo/vector-icons";
import { Trans } from "@lingui/macro";

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
            <Input label={<Trans>Email</Trans>} iconPack={Feather} icon="mail" iconSize={20} />
            <Input
                label={<Trans>Password</Trans>}
                iconPack={Feather}
                icon="lock"
                iconSize={20}
                secureTextEntry
            />
            <SubmitButton style={globalStyles["marginT-20"]} title={<Trans>Sign in</Trans>} />
            <SubmitButton
                style={{ ...globalStyles["marginT-5"], backgroundColor: theme.colors.background }}
                titleStyle={{ color: theme.colors.primary }}
                title={<Trans>Sign Up</Trans>}
                onPress={() => {
                    navigation.navigate("SignUpScreen");
                }}
            />
        </PageContainer>
    );
};

export default SignInScreen;
