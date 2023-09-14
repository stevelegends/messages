// react
import React, { FC, useState } from "react";

// modules
import { StackNavigationProp } from "@react-navigation/stack";
import { Feather, AntDesign } from "@expo/vector-icons";
import { msg, Trans } from "@lingui/macro";
import { KeyboardAvoidingView, Platform, ScrollView, StyleSheet } from "react-native";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { i18n } from "@lingui/core";
import Animated, { SlideInDown, SlideOutDown } from "react-native-reanimated";

// navigation
import { AuthStackNavigatorParams } from "@navigation/auth-navigation";

// styles
import styles from "./sign-in-screen.styles";

// components
import { Input, PageContainer, SubmitButton, ToggleEyeButton } from "@components";

// theme
import { globalSize, globalStyles } from "@theme/theme";

// hooks
import { useTheme } from "@react-navigation/native";
import { useForm } from "react-hook-form";

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
    const [isHidePassword, setIsHidePassword] = useState<boolean>(true);

    const {
        control,
        handleSubmit,
        formState: { errors }
    } = useForm<SignInFormData>({
        resolver: yupResolver(schema)
    });

    const onSubmit = (data: SignInFormData) => {
        console.log(JSON.stringify(data, "", "\t"));
    };

    return (
        <PageContainer>
            {theme.dark ? (
                <Animated.View
                    entering={SlideInDown}
                    exiting={SlideOutDown}
                    style={[StyleSheet.absoluteFill, { backgroundColor: theme.colors.background }]}
                />
            ) : null}
            <ScrollView>
                <KeyboardAvoidingView
                    style={[globalStyles["flex-1"], globalStyles["flex-jc-center"]]}
                    behavior={Platform.select({ ios: "height" })}
                    keyboardVerticalOffset={100}
                >
                    <Animated.View
                        sharedTransitionTag="appLogo"
                        style={[globalStyles["flex-center"], globalStyles["paddingV-20"]]}
                    >
                        <AntDesign
                            name="message1"
                            size={globalSize.screenWidth / 4}
                            color={theme.colors.primary}
                        />
                    </Animated.View>
                    <Input
                        label={<Trans>Email</Trans>}
                        iconPack={Feather}
                        icon="mail"
                        iconSize={20}
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
                        iconSize={20}
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
                    />
                </KeyboardAvoidingView>
            </ScrollView>
        </PageContainer>
    );
};

export default SignInScreen;
