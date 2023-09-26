import * as FileSystem from "expo-file-system";

export const getImageSizeToMBAsync = async (imageUri: string) => {
    const fileInfo = await FileSystem.getInfoAsync(imageUri);

    if (!fileInfo.exists) throw { code: "file-does-not-exist" };
    const fileSizeInMB = fileInfo.size / (1024 * 1024); // Convert to MB

    return fileSizeInMB;
};

export const getImageSizeToKBAsync = async (imageUri: string) => {
    const fileInfo = await FileSystem.getInfoAsync(imageUri);

    if (!fileInfo.exists) throw { code: "file-does-not-exist" };
    const fileSizeInKB = fileInfo.size / 1024; // Convert to KB

    return fileSizeInKB;
};
