// react
import React, { FC, Fragment, useState } from "react";

// modules
import { Pressable, View, ViewStyle } from "react-native";
import { FontAwesome } from "@expo/vector-icons";
import { t } from "@lingui/macro";

// styles
import styles from "./profile-image.styles";

// components
import { CircleImage, Text } from "@components";
import AnimatedOption from "./animated-option";

// theme
import { globalSize, globalStyles } from "@theme/theme";

// hooks
import { useTheme } from "@react-navigation/native";
import useFirebase from "@hooks/use-firebase";
import useNavigation from "@hooks/use-navigation";
import { useLingui } from "@lingui/react";

// utils
import { onLaunchImageLibraryAsync } from "@utils";

// store
import useAuth from "@store/features/auth/use-auth";

type ProfileImageProps = {};

const ImageSize = globalSize.screenWidth / 4;

const ProfileImage: FC<ProfileImageProps> = () => {
    const navigation = useNavigation();
    const { i18n } = useLingui();
    const theme = useTheme();
    const firebase = useFirebase();
    const { userData, setUserDataAction } = useAuth();

    const [uriResult, setUriResult] = useState<string | undefined>(userData.profilePicture);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [isShowOption, setIsShowOption] = useState(false);
    console.log("userData", userData);
    const handlePickImageOnPress = async () => {
        setIsLoading(true);
        const result = await onLaunchImageLibraryAsync("photo", true, false, true);
        if (!result.canceled) {
            const asset = result.assets[0];
            if (asset.uri) {
                setUriResult(asset.uri);
                firebase.onUploadImageAsync(asset.uri, setIsLoading, payload => {
                    firebase.onUpdateSignedInUserAvatarData(
                        { userId: userData.userId, url: payload.url },
                        undefined,
                        payload => {
                            const newUserData = {
                                ...userData,
                                ...payload.userData
                            };
                            setUserDataAction({ userData: newUserData });
                        }
                    );
                });
            }
        } else {
            setIsLoading(false);
        }
    };

    const handleImageOnPress = async () => {
        setIsShowOption(prevState => !prevState);
    };

    const handleReviewImageOnPress = () => {
        navigation.navigate("ReviewImageModal", { url: uriResult ? uriResult : "" });
    };

    return (
        <Fragment>
            <View
                style={[styles.container, globalStyles["paddingH-20"], globalStyles["marginT-20"]]}
            >
                <CircleImage
                    size={ImageSize}
                    onPress={handleImageOnPress}
                    source={{ uri: uriResult }}
                    loading={isLoading}
                />
                {!isLoading && !uriResult && (
                    <Text style={styles.placeholderText}>{userData.firstName[0]}</Text>
                )}
                <Pressable
                    style={[
                        {
                            left: ImageSize / 2 + 35,
                            backgroundColor: theme.colors.background,
                            borderColor: theme.colors.text
                        },
                        editViewStyle
                    ]}
                    onPress={handleImageOnPress}
                >
                    <FontAwesome name="pencil" size={18} color={theme.colors.text} />
                </Pressable>
                <AnimatedOption
                    show={isShowOption}
                    cancelOnPress={setIsShowOption}
                    options={[
                        {
                            title: t(i18n)`Upload picture `,
                            id: "2",
                            onPress: () => {
                                setIsShowOption(false);
                                handlePickImageOnPress();
                            }
                        },
                        {
                            title: t(i18n)`View picture`,
                            id: "1",
                            onPress: () => {
                                setIsShowOption(false);
                                handleReviewImageOnPress();
                            },
                            disabled: !uriResult
                        }
                    ]}
                />
            </View>
        </Fragment>
    );
};

const editViewStyle: ViewStyle = {
    position: "absolute",
    bottom: 0,
    borderWidth: 1,
    width: 30,
    aspectRatio: 1,
    borderRadius: 15,
    justifyContent: "center",
    alignItems: "center"
};

export default ProfileImage;