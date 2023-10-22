import * as ImagePicker from "expo-image-picker";
import { Platform } from "react-native";

// utils
import ErrorHandler from "./error-handler";

export type ImagePickerResult = ImagePicker.ImagePickerResult;
export type ImageInfo = {
    uri: string;
    width: number;
    height: number;
    type?: "image" | "video";
};

export const parseUri = (result: { uri: string }, withPrefix: boolean = false): string => {
    if (withPrefix) {
        return result.uri;
    }
    return Platform.OS === "ios"
        ? result.uri.replace("file://", "")
        : result.uri.replace("file:", "");
};

const defaultOptions = {
    allowsEditing: false,
    exif: false,
    quality: 0.4,
    videoQuality: ImagePicker.UIImagePickerControllerQualityType.Medium
    // even though this is marked as deprecated if its not set it will IGNORE ALL OTHER SETTINGS we pass here
    // videoExportPreset: ImagePicker.VideoExportPreset.HighestQuality,
} as const;

const mediaTypeToImagePickerMediaType = (
    mediaType: "photo" | "video" | "mixed"
): ImagePicker.MediaTypeOptions =>
    mediaType === "photo"
        ? ImagePicker.MediaTypeOptions.Images
        : mediaType === "video"
        ? ImagePicker.MediaTypeOptions.Videos
        : ImagePicker.MediaTypeOptions.All;

export const onLaunchCameraAsync = async (
    mediaType: "photo" | "video" | "mixed",
    askPermAndRetry: boolean = true
): Promise<ImagePicker.ImagePickerResult | null> => {
    try {
        const res = await ImagePicker.launchCameraAsync({
            ...defaultOptions,
            mediaTypes: mediaTypeToImagePickerMediaType(mediaType)
        });
        return res;
    } catch (e) {
        if (!askPermAndRetry) {
            ErrorHandler(e, "onLaunchCameraAsync", true);
            return null;
        }
        try {
            await ImagePicker.requestCameraPermissionsAsync();
        } catch {}
        try {
            await ImagePicker.requestMediaLibraryPermissionsAsync();
        } catch {}
        return onLaunchCameraAsync(mediaType, false);
    }
};

export const onLaunchImageLibraryAsyncUri = async (_: string): Promise<Array<string>> => {
    try {
        const result = await onLaunchImageLibraryAsync("photo");
        return result.canceled ? [] : result.assets?.map(a => parseUri(a)) ?? [];
    } catch (e) {
        ErrorHandler(e, "onLaunchImageLibraryAsyncUri", true);
    }
    return [];
};

export const onLaunchImageLibraryAsync = async (
    mediaType: "photo" | "video" | "mixed",
    askPermAndRetry: boolean = true,
    allowsMultipleSelection: boolean = false,
    allowsEditing: boolean = false
): Promise<ImagePicker.ImagePickerResult> => {
    try {
        const res = await ImagePicker.launchImageLibraryAsync({
            ...defaultOptions,
            allowsMultipleSelection,
            allowsEditing,
            ...(mediaType === "video"
                ? { allowsEditing: true, allowsMultipleSelection: false }
                : {}),
            mediaTypes: mediaTypeToImagePickerMediaType(mediaType)
        });
        return res;
    } catch (e) {
        if (!askPermAndRetry) {
            throw e;
        }
        try {
            await ImagePicker.requestMediaLibraryPermissionsAsync();
        } catch {}
        return onLaunchImageLibraryAsync(mediaType, false, allowsMultipleSelection);
    }
};
