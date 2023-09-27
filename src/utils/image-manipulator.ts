import * as ImageManipulator from "expo-image-manipulator";

import { getImageSizeToKBAsync } from "./file-system";

export const onCompressImage = async ({
    quality = 1,
    uri,
    size = 1024
}: {
    uri: string;
    quality?: number;
    size?: number;
}) => {
    const { uri: compressedUri } = await ImageManipulator.manipulateAsync(
        uri,
        [{ resize: { width: size } }],
        {
            compress: quality
        }
    );
    return compressedUri;
};

export const compressImageEachSize = async (
    uri: string,
    maxSizeKB: number,
    size?: number
): Promise<string> => {
    // TODO optimize compress
    const fileSizeInKB = await getImageSizeToKBAsync(uri);
    if (fileSizeInKB <= maxSizeKB) {
        return uri;
    }

    try {
        const qualities = [1, 0.9, 0.8, 0.7, 0.6, 0.5, 0.4, 0.3, 0.2, 0.1];
        for (let i = 0; i <= qualities.length - 1; i++) {
            const quality = qualities[i];
            const compressUri = await onCompressImage({ quality, uri, size });
            const fileSizeInKBAtQuality = await getImageSizeToKBAsync(compressUri);
            if (fileSizeInKBAtQuality <= 100) {
                return compressUri;
            } else if (i === qualities.length - 1) {
                return compressUri;
            }
        }
    } catch (e) {
        __DEV__ && console.log("compressImageSize error", e);
    }
    return uri;
};
