// react
import React, { FC } from "react";

// modules
import { StackNavigationProp } from "@react-navigation/stack";
import { Feather, FontAwesome } from "@expo/vector-icons";
import { msg, Trans } from "@lingui/macro";
import { KeyboardAvoidingView, Platform, ScrollView, View } from "react-native";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { i18n } from "@lingui/core";
import Animated from "react-native-reanimated";

// navigation
import { AuthStackNavigatorParams } from "@navigation/auth-navigation";

// styles
import styles from "./sign-up-screen.styles";

// theme
import { globalSize, globalStyles } from "@theme/theme";

// components
import { Input, PageContainer, SubmitButton } from "@components";

// hooks
import { useTheme } from "@react-navigation/native";
import { useForm } from "react-hook-form";

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
        firstName: yup.string().required(i18n._(msg`First name is a required`)),
        lastName: yup.string().required(i18n._(msg`Last name is a required`)),
        email: yup
            .string()
            .required(i18n._(msg`Email is a required`))
            .email(i18n._(msg`Email must be a valid email`)),
        password: yup.string().required(i18n._(msg`Password is a required`))
    })
    .required();

const SignUpScreen: FC<SignUpScreenProps> = ({ navigation }) => {
    const theme = useTheme();

    const {
        control,
        handleSubmit,
        formState: { errors }
    } = useForm<SignUpFormData>({
        resolver: yupResolver(schema)
    });

    const onSubmit = (data: SignUpFormData) => {
        console.log(JSON.stringify(data, "", "\t"));
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
                        sharedTransitionTag="appLogo"
                        style={[globalStyles["flex-center"]]}
                    >
                        <Feather
                            name="message-circle"
                            size={globalSize.screenWidth / 3}
                            color={theme.colors.primary}
                        />
                    </Animated.View>
                    <Input
                        label={<Trans>First name</Trans>}
                        iconPack={FontAwesome}
                        icon="user-o"
                        iconSize={20}
                        control={control}
                        name="firstName"
                        errorText={errors.firstName?.message}
                    />
                    <Input
                        label={<Trans>Last name</Trans>}
                        iconPack={FontAwesome}
                        icon="user-o"
                        iconSize={20}
                        control={control}
                        name="lastName"
                        errorText={errors.lastName?.message}
                    />
                    <Input
                        label={<Trans>Email</Trans>}
                        iconPack={Feather}
                        icon="mail"
                        iconSize={20}
                        control={control}
                        name="email"
                        errorText={errors.email?.message}
                    />
                    <Input
                        label={<Trans>Password</Trans>}
                        iconPack={Feather}
                        icon="lock"
                        iconSize={20}
                        secureTextEntry
                        control={control}
                        name="password"
                        errorText={errors.password?.message}
                    />
                    <SubmitButton
                        style={globalStyles["marginT-20"]}
                        title="Sign up"
                        onPress={handleSubmit(onSubmit)}
                    />
                </KeyboardAvoidingView>
            </ScrollView>
        </PageContainer>
    );
};

export default SignUpScreen;
