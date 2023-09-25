// react
import React, { FC, Fragment, useCallback, useMemo, useState } from "react";

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
import { ErrorHandler, onLaunchImageLibraryAsync } from "@utils";

// store
import useAuth from "@store/features/auth/use-auth";

type ProfileImageProps = {};

const ImageSize = globalSize.screenWidth / 4;

const ProfileImage: FC<ProfileImageProps> = () => {
    const navigation = useNavigation();
    const { i18n } = useLingui();
    const theme = useTheme();
    const firebase = useFirebase();
    const { userData, setUserDataOverrideAction } = useAuth();

    const [uriResult, setUriResult] = useState<string | undefined>(userData.profilePicture);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [isShowOption, setIsShowOption] = useState(false);

    const handlePickImageOnPress = async () => {
        setIsLoading(true);

        try {
            const result = await onLaunchImageLibraryAsync("photo", true, false, true);
            if (result.canceled) {
                setIsLoading(false);
                return;
            }

            const assetUri = result.assets[0].uri;
            if (assetUri) {
                // DEPRECATED
                // setUriResult(assetUri);

                firebase.onUploadImageAsync(assetUri, setIsLoading, payload => {
                    setUriResult(payload.url);
                    firebase.onUpdateSignedInUserAvatarData(
                        { userId: userData.userId, url: payload.url },
                        undefined,
                        payload => {
                            setUserDataOverrideAction({ userData: payload });
                        }
                    );
                });

                return;
            }
        } catch (e) {
            ErrorHandler(e, "handlePickImageOnPress");
        }

        setIsLoading(false);
    };

    const handleImageOnPress = useCallback(() => {
        setIsShowOption(prevState => !prevState);
    }, []) as () => void;

    const handleReviewImageOnPress = () => {
        navigation.navigate("ReviewImageModal", { url: uriResult ? uriResult : "" });
    };

    const sourceUri = useMemo(() => {
        return { uri: uriResult };
    }, [uriResult]);

    return (
        <Fragment>
            <View
                style={[styles.container, globalStyles["paddingH-20"], globalStyles["marginT-50"]]}
            >
                <View>
                    <CircleImage
                        size={ImageSize}
                        onPress={handleImageOnPress}
                        source={sourceUri}
                        loading={isLoading}
                    />
                </View>
                {!isLoading && !uriResult && (
                    <Text style={styles.placeholderText as any}>
                        {userData.firstName?.[0]?.toUpperCase()}
                    </Text>
                )}
                <Pressable
                    style={[
                        editViewStyle,
                        {
                            left: ImageSize / 2 + 35,
                            backgroundColor: theme.colors.background,
                            borderColor: theme.colors.text
                        }
                    ]}
                    onPress={handleImageOnPress}
                >
                    <FontAwesome name="pencil" size={15} color={theme.colors.text} />
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
