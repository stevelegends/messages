// react
import React, { FC, useState } from "react";

// modules
import { StackNavigationProp } from "@react-navigation/stack";
import { Feather, FontAwesome } from "@expo/vector-icons";
import { msg, Trans } from "@lingui/macro";
import { KeyboardAvoidingView, Platform, ScrollView } from "react-native";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { i18n } from "@lingui/core";
import Animated, { ZoomIn, ZoomOut } from "react-native-reanimated";

// navigation
import { AuthStackNavigatorParams } from "@navigation/auth-navigator";

// styles
import styles from "./sign-up-screen.styles";

// theme
import { globalStyles } from "@theme/theme";

// components
import { AppLogoImage, Input, PageContainer, SubmitButton, ToggleEyeButton } from "@components";

// hooks
import { useTheme } from "@react-navigation/native";
import { useForm } from "react-hook-form";
import { useFirebase } from "@hooks/index";

// store
import useAuth from "@store/features/auth/use-auth";

// contexts
import { useNotificationProvider } from "@contexts/notification-context";

type SignUpScreenProps = {
    navigation: StackNavigationProp<AuthStackNavigatorParams, "SignUpScreen">;
};

type SignUpFormData = {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
};

const schema = yup
    .object({
        firstName: yup
            .string()
            .matches(/^[A-Za-z 0-9]*$/, i18n._(msg`Please enter valid first name`))
            .max(40, i18n._(msg`First name must be at most 40 characters`))
            .required(i18n._(msg`First name is a required`)),
        lastName: yup
            .string()
            .matches(/^[A-Za-z 0-9]*$/, i18n._(msg`Please enter valid last name`))
            .max(40, i18n._(msg`Last name must be at most 40 characters`))
            .required(i18n._(msg`Last name is a required`)),
        email: yup
            .string()
            .required(i18n._(msg`Email is a required`))
            .email(i18n._(msg`Email must be a vali email`)),
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

const SignUpScreen: FC<SignUpScreenProps> = ({ navigation }) => {
    const firebase = useFirebase();
    const auth = useAuth();
    const notification = useNotificationProvider();

    const [isLoading, setIsLoading] = useState<boolean>(false);

    const {
        control,
        handleSubmit,
        formState: { errors }
    } = useForm<SignUpFormData>({
        resolver: yupResolver(schema),
        defaultValues: {
            firstName: __DEV__ ? "Ledge" : "",
            lastName: __DEV__ ? "Testnet" : "",
            email: __DEV__ ? "devfptpoly@gmail.com" : "",
            password: __DEV__ ? "123456Aa!" : ""
        }
    });

    const [isHidePassword, setIsHidePassword] = useState<boolean>(true);

    const onSubmit = (data: SignUpFormData) => {
        firebase.onSignUp(
            data,
            setIsLoading,
            payload => {
                auth.setUserDataAction({ userData: payload.userData });
                auth.setTokenAction({ token: payload.token });
            },
            error => {
                notification.addStack({
                    status: "error",
                    message: error.message,
                    title: error.title,
                    timeout: 3000
                });
            }
        );
    };

    return (
        <PageContainer>
            <ScrollView showsVerticalScrollIndicator={false}>
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
                        label={<Trans>First name</Trans>}
                        iconPack={FontAwesome}
                        icon="user-o"
                        iconSize={15}
                        autoCapitalize="none"
                        control={control}
                        name="firstName"
                        errorText={errors.firstName?.message}
                    />
                    <Input
                        label={<Trans>Last name</Trans>}
                        iconPack={FontAwesome}
                        icon="user-o"
                        iconSize={15}
                        autoCapitalize="none"
                        control={control}
                        name="lastName"
                        errorText={errors.lastName?.message}
                    />
                    <Input
                        label={<Trans>Email</Trans>}
                        iconPack={Feather}
                        icon="mail"
                        iconSize={15}
                        autoCapitalize="none"
                        control={control}
                        name="email"
                        errorText={errors.email?.message}
                    />
                    <Input
                        label={<Trans>Password</Trans>}
                        iconPack={Feather}
                        icon="lock"
                        iconSize={15}
                        autoCapitalize="none"
                        secureTextEntry={isHidePassword}
                        control={control}
                        name="password"
                        errorText={errors.password?.message}
                        rightView={
                            <ToggleEyeButton isOff={isHidePassword} onPress={setIsHidePassword} />
                        }
                    />
                    <SubmitButton
                        style={globalStyles["marginT-20"]}
                        title={<Trans>Sign up</Trans>}
                        onPress={handleSubmit(onSubmit)}
                        loading={isLoading}
                    />
                </KeyboardAvoidingView>
            </ScrollView>
        </PageContainer>
    );
};

export default SignUpScreen;
