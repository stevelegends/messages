// react
import React, { FC } from "react";

// modules
import { StackNavigationProp } from "@react-navigation/stack";
import { Feather, FontAwesome } from "@expo/vector-icons";

// navigation
import { AuthStackNavigatorParams } from "@navigation/auth-navigation";

// styles
import styles from "./sign-up-screen.styles";

// theme
import { globalStyles } from "@theme/theme";

// components
import { Input, PageContainer, SubmitButton } from "@components";

type SignUpScreenProps = {
    navigation: StackNavigationProp<AuthStackNavigatorParams, "SignUpScreen">;
};

const SignUpScreen: FC<SignUpScreenProps> = ({ navigation }) => {
    return (
        <PageContainer>
            <Input label="First name" iconPack={FontAwesome} icon="user-o" iconSize={20} />
            <Input label="Last name" iconPack={FontAwesome} icon="user-o" iconSize={20} />
            <Input label="Email" iconPack={Feather} icon="mail" iconSize={20} />
            <Input label="Password" iconPack={Feather} icon="lock" iconSize={20} secureTextEntry />
            <SubmitButton
                style={globalStyles["marginT-20"]}
                title="Sign up"
                onPress={() => {
                    navigation.navigate("SignInScreen");
                }}
            />
        </PageContainer>
    );
};

export default SignUpScreen;
