import * as Clipboard from "expo-clipboard";

export const onCopyToClipboardAsync = async (message?: string): Promise<void> => {
    if (message) {
        await Clipboard.setStringAsync(message);
    }
};

export const onFetchCopiedTextAsync = async (): Promise<string> => {
    return Clipboard.getStringAsync();
};
