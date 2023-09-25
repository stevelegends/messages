// react
import React, { FC, useEffect, useState } from "react";

// modules
import { StackNavigationProp } from "@react-navigation/stack";
import { Feather } from "@expo/vector-icons";
import { msg, Trans } from "@lingui/macro";
import { KeyboardAvoidingView, Platform, ScrollView } from "react-native";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { i18n } from "@lingui/core";
import Animated, { ZoomIn, ZoomOut } from "react-native-reanimated";

// navigation
import { AuthStackNavigatorParams } from "@navigation/auth-navigation";

// styles
import styles from "./sign-in-screen.styles";

// components
import { AppLogoImage, Input, PageContainer, SubmitButton, ToggleEyeButton } from "@components";

// theme
import { globalStyles } from "@theme/theme";

// hooks
import { useTheme } from "@react-navigation/native";
import { useForm } from "react-hook-form";
import { useFirebase } from "@hooks/index";

// store
import useAuth from "@store/features/auth/use-auth";

type SignInScreenProps = {
    navigation: StackNavigationProp<AuthStackNavigatorParams, "SignInScreen">;
};

type SignInFormData = {
    email: string;
    password: string;
};

const schema = yup
    .object({
        email: yup
            .string()
            .required(i18n._(msg`Email is a required`))
            .email(i18n._(msg`Email must be a valid email`)),
        password: yup
            .string()
            .required(i18n._(msg`Password is a required`))
            .matches(
                /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{6,})/,
                i18n._(
                    msg`Password must Contain 6 Characters, One Uppercase, One Lowercase, One Number and One Special Case Character`
                )
            )
    })
    .required();

const SignInScreen: FC<SignInScreenProps> = ({ navigation }) => {
    const theme = useTheme();
    const firebase = useFirebase();
    const auth = useAuth();

    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [isHidePassword, setIsHidePassword] = useState<boolean>(true);

    const {
        control,
        handleSubmit,
        formState: { errors }
    } = useForm<SignInFormData>({
        resolver: yupResolver(schema),
        defaultValues: {
            email: __DEV__ ? "devfptpoly@gmail.com" : "",
            password: __DEV__ ? "123456Aa!" : ""
        }
    });

    const onSubmit = (data: SignInFormData) => {
        firebase.onSignIn(data, setIsLoading, payload => {
            auth.setTokenAction({ token: payload.token });
            auth.setUserDataAction({ userData: payload.userData });
        });
    };

    return (
        <PageContainer>
            <ScrollView>
                <KeyboardAvoidingView
                    style={[globalStyles["flex-1"], globalStyles["flex-jc-center"]]}
                    behavior={Platform.select({ ios: "height" })}
                    keyboardVerticalOffset={100}
                >
                    <Animated.View
                        style={[globalStyles["flex-center"], globalStyles["paddingV-20"]]}
                    >
                        <AppLogoImage type="primary" />
                    </Animated.View>
                    <Input
                        label={<Trans>Email</Trans>}
                        iconPack={Feather}
                        icon="mail"
                        iconSize={15}
                        autoCapitalize="none"
                        control={control}
                        name="email"
                        errorText={errors.email?.message}
                        keyboardType="email-address"
                    />
                    <Input
                        label={<Trans>Password</Trans>}
                        iconPack={Feather}
                        icon="lock"
                        iconSize={15}
                        secureTextEntry={isHidePassword}
                        autoCapitalize="none"
                        control={control}
                        name="password"
                        errorText={errors.password?.message}
                        rightView={
                            <ToggleEyeButton isOff={isHidePassword} onPress={setIsHidePassword} />
                        }
                    />
                    <SubmitButton
                        style={globalStyles["marginT-20"]}
                        title={<Trans>Sign in</Trans>}
                        onPress={handleSubmit(onSubmit)}
                        loading={isLoading}
                    />
                    <SubmitButton
                        style={{
                            ...globalStyles["marginT-5"],
                            backgroundColor: theme.colors.background
                        }}
                        titleStyle={{ color: theme.colors.primary }}
                        title={<Trans>Switch to sign up</Trans>}
                        onPress={() => {
                            navigation.navigate("SignUpScreen");
                        }}
                        disabled={isLoading}
                    />
                </KeyboardAvoidingView>
            </ScrollView>
        </PageContainer>
    );
};

export default SignInScreen;
