import * as ImagePicker from "expo-image-picker";

export const onPickImage = async (): Promise<string> => {
    /**
     * No permission request is necessary for launching the image library
     */

    let result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.All,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 1
    });

    __DEV__ && console.log(result);

    if (!result.canceled) {
        return result.assets[0].uri;
    }
    return "";
};
