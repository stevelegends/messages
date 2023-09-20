// react
import React, { FC, useEffect, useState } from "react";

// modules
import { View } from "react-native";
import { StackNavigationProp } from "@react-navigation/stack";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { i18n } from "@lingui/core";
import { msg, Trans } from "@lingui/macro";
import { Feather, FontAwesome } from "@expo/vector-icons";

// navigation
import { BottomTabStackNavigatorParams } from "@navigation/bottom-tab-navigation";

// styles
import styles from "./chat-settings-screen.styles";

// hook
import { useForm } from "react-hook-form";

// components
import { Input, SubmitButton } from "@components";

// theme
import { globalStyles } from "@theme/theme";

// store
import useAuth from "@store/features/auth/use-auth";
import { useFirebase } from "@hooks/index";

type ChatSettingsScreenProps = {
    navigation: StackNavigationProp<BottomTabStackNavigatorParams, "ChatSettingsScreen">;
};

type UserFormData = {
    firstName: string;
    lastName: string;
    email: string;
    about?: string;
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
        about: yup.string().max(150, i18n._(msg`About is too long (maximum is 150 characters)`))
    })
    .required();

const ChatSettingsScreen: FC<ChatSettingsScreenProps> = () => {
    const { userData, setUserDataAction } = useAuth();
    const firebase = useFirebase();

    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [disabled, setDisabled] = useState<boolean>(true);

    const {
        control,
        handleSubmit,
        formState: { errors },
        watch
    } = useForm<UserFormData>({
        resolver: yupResolver(schema),
        defaultValues: {
            firstName: userData.firstName,
            lastName: userData.lastName,
            email: userData.email,
            about: userData.about
        }
    });
    console.log("userData", userData);
    const onSubmit = (data: UserFormData) => {
        firebase.onUpdateSignedInUserData(
            { userId: userData.userId, newData: data },
            isLoading => {
                setIsLoading(isLoading);
                if (!isLoading) {
                    setDisabled(true);
                }
            },
            payload => {
                const newUserData = {
                    ...userData,
                    ...payload.userData
                };
                setUserDataAction({ userData: newUserData });
            }
        );
    };

    useEffect(() => {
        const subscription = watch((value, { name, type }) => {
            if (type === "change") {
                const isChanged = userData[name as string] === value[name];
                setDisabled(isChanged);
            }
        });
        return () => subscription.unsubscribe();
    }, [watch]);

    return (
        <View style={[styles.container, globalStyles["paddingH-20"]]}>
            <Input
                label={<Trans>First name</Trans>}
                iconPack={FontAwesome}
                icon="user-o"
                iconSize={20}
                autoCapitalize="none"
                control={control}
                name="firstName"
                errorText={errors.firstName?.message}
            />
            <Input
                label={<Trans>Last name</Trans>}
                iconPack={FontAwesome}
                icon="user-o"
                iconSize={20}
                autoCapitalize="none"
                control={control}
                name="lastName"
                errorText={errors.lastName?.message}
            />
            <Input
                label={<Trans>Email</Trans>}
                iconPack={Feather}
                icon="mail"
                iconSize={20}
                autoCapitalize="none"
                control={control}
                name="email"
                errorText={errors.email?.message}
                editable={false}
            />
            <Input
                label={<Trans>About</Trans>}
                iconPack={FontAwesome}
                icon="user-o"
                iconSize={20}
                autoCapitalize="none"
                control={control}
                name="about"
                errorText={errors.about?.message}
            />
            <SubmitButton
                style={globalStyles["marginT-20"]}
                title={<Trans>Save</Trans>}
                onPress={handleSubmit(onSubmit)}
                loading={isLoading}
                disabled={disabled}
            />
        </View>
    );
};

export default ChatSettingsScreen;
