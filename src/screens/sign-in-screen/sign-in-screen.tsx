// react
import React, { FC } from "react";

// modules
import { StackNavigationProp } from "@react-navigation/stack";
import { Feather } from "@expo/vector-icons";
import { msg, Trans } from "@lingui/macro";
import { KeyboardAvoidingView, Platform, ScrollView, View } from "react-native";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { i18n } from "@lingui/core";

// navigation
import { AuthStackNavigatorParams } from "@navigation/auth-navigation";

// styles
import styles from "./sign-in-screen.styles";

// components
import { Input, PageContainer, SubmitButton } from "@components";

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
        password: yup.string().required(i18n._(msg`Password is a required`))
    })
    .required();

const SignInScreen: FC<SignInScreenProps> = ({ navigation }) => {
    const theme = useTheme();

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
            <ScrollView>
                <KeyboardAvoidingView
                    style={[globalStyles["flex-1"], globalStyles["flex-jc-center"]]}
                    behavior={Platform.select({ ios: "height" })}
                    keyboardVerticalOffset={100}
                >
                    <View style={[globalStyles["flex-center"]]}>
                        <Feather
                            name="message-circle"
                            size={globalSize.screenWidth / 3}
                            color={theme.colors.primary}
                        />
                    </View>
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
                        title={<Trans>Sign in</Trans>}
                        onPress={handleSubmit(onSubmit)}
                    />
                    <SubmitButton
                        style={{
                            ...globalStyles["marginT-5"],
                            backgroundColor: theme.colors.background
                        }}
                        titleStyle={{ color: theme.colors.primary }}
                        title={<Trans>Sign Up</Trans>}
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
