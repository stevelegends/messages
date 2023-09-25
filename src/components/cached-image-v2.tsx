import React, { Fragment, useEffect, useRef, useState } from "react";

// modules
import { Image, ImageProps, ImageURISource, InteractionManager, View } from "react-native";
import * as Crypto from "expo-crypto";
import * as FileSystem from "expo-file-system";
import { useSharedValue } from "react-native-reanimated";

// components
import AnimatedCircleProgress from "./animated-circle-progress";

//  hooks
import { useTheme } from "@react-navigation/native";

type Interaction = {
    then: (
        onfulfilled?: (() => unknown) | undefined,
        onrejected?: (() => unknown) | undefined
    ) => Promise<unknown>;
    done: (...args: []) => unknown;
    cancel: () => void;
};

type Props = {
    cachedResourceCallback?: (uri: string | null) => void;
} & ImageProps;

const CachedImageV2: React.FC<Props> = props => {
    const source = props.source as Omit<ImageURISource, "uri"> & { uri: string };

    const theme = useTheme();

    const [imgURI, setImgURI] = useState<string | null>("");

    const mounted = useRef<boolean>(true);
    const interaction = useRef<Interaction | null>(null);
    const downloadResumable = useRef<FileSystem.DownloadResumable | null>(null);

    const sharedPercentage = useSharedValue<number>(0);

    const onSetSharedPercentage = (percentage: number) => {
        if (mounted.current) {
            sharedPercentage.value = percentage;
        }
    };

    const onSetImgURI = (uri: string | null, tag: string) => {
        if (mounted.current) {
            __DEV__ && console.log(" onSetImgURI tag: " + tag, uri);
            setImgURI(uri);
            props.cachedResourceCallback && props.cachedResourceCallback(uri);
        }
    };

    const checkClear = async () => {
        try {
            if (downloadResumable.current) {
                const t = await downloadResumable.current.pauseAsync();
                const filesystemURI = await getImageFilesystemKey(source.uri);
                const metadata = await FileSystem.getInfoAsync(filesystemURI);
                if (metadata.exists) {
                    await FileSystem.deleteAsync(t.fileUri);
                }
            }
        } catch (error) {
            __DEV__ && console.log("checkClear", error);
        }
    };

    const getImageFilesystemKey = async (remoteURI: string) => {
        const hashed = await Crypto.digestStringAsync(
            Crypto.CryptoDigestAlgorithm.SHA256,
            remoteURI
        );
        return `${FileSystem.documentDirectory}${hashed}`;
    };

    const loadImage = async (filesystemURI: string, remoteURI: string) => {
        onSetSharedPercentage(0);

        if (downloadResumable.current && (downloadResumable.current as any)?._removeSubscription) {
            await (downloadResumable.current as any)?._removeSubscription();
            __DEV__ && console.log("loadImage", "_removeSubscription");
        }
        try {
            const metadata = await FileSystem.getInfoAsync(filesystemURI);
            if (metadata.exists) {
                onSetImgURI(filesystemURI, "loadImage/metadata.exists");
                onSetSharedPercentage(100);
                return;
            }

            downloadResumable.current = FileSystem.createDownloadResumable(
                remoteURI,
                filesystemURI,
                {},
                dp => onDownloadUpdate(dp)
            );
            const imageObject = await downloadResumable.current.downloadAsync();
            if (imageObject && imageObject.status === 200) {
                onSetImgURI(imageObject.uri, "loadImage/imageObject && imageObject.status === 200");
            }
        } catch (err: any) {
            onSetImgURI(null, "loadImage/error: " + err.message);
            const metadata = await FileSystem.getInfoAsync(filesystemURI);
            if (metadata.exists) {
                try {
                    await FileSystem.deleteAsync(filesystemURI);
                } catch (err) {}
            }
        }
    };

    const onDownloadUpdate = (downloadProgress: FileSystem.DownloadProgressData) => {
        const progress =
            (downloadProgress.totalBytesWritten / downloadProgress.totalBytesExpectedToWrite) * 100;
        onSetSharedPercentage(progress);

        if (downloadProgress.totalBytesWritten >= downloadProgress.totalBytesExpectedToWrite) {
            if (
                downloadResumable.current &&
                (downloadResumable.current as any)?._removeSubscription
            ) {
                (downloadResumable.current as any)?._removeSubscription();
                __DEV__ && console.log("onDownloadUpdate", "_removeSubscription");
            }
            downloadResumable.current = null;
        }
    };

    let imageSource = imgURI ? { uri: imgURI } : source;

    if (!source && source) {
        imageSource = { ...(source as any), cache: "force-cache" };
    }

    useEffect(() => {
        if (source && source.uri && source.uri.startsWith("https://")) {
            const runAfterInteractions = async () => {
                const filesystemURI = await getImageFilesystemKey(source.uri);
                await loadImage(filesystemURI, source.uri);
            };

            mounted.current = true;
            interaction.current = InteractionManager.runAfterInteractions(runAfterInteractions);

            return () => {
                interaction.current && interaction.current.cancel();
                mounted.current = false;
                checkClear();
            };
        }
    }, [source]);

    const width = props.width || (props.style as any).width;

    return (
        <Fragment>
            <Image {...props} source={imageSource} />
            {typeof width === "number" && (
                <View
                    style={{
                        width: width,
                        height: width,
                        borderRadius: width / 2,
                        position: "absolute"
                    }}
                >
                    <AnimatedCircleProgress
                        color={theme.colors.primary}
                        percentage={sharedPercentage}
                        radius={width / 2}
                        borderWidth={2}
                    />
                </View>
            )}
        </Fragment>
    );
};

export default CachedImageV2;
