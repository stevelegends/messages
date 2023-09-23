import * as Crypto from "expo-crypto";
import CryptoES from "crypto-es";

export const generateUUID = () => Crypto.randomUUID();

const encryptData = async (dataToEncrypt: string) => {
    try {
        const hashedData = await Crypto.digestStringAsync(
            Crypto.CryptoDigestAlgorithm.SHA256,
            dataToEncrypt
        );
        return hashedData;
    } catch (error) {
        __DEV__ && console.error("Encryption Error:", error);
    }
    return null;
};

export const generateHashedUUID = async (uuid: string): Promise<string> => {
    const hashedUUID = await encryptData(uuid);
    if (hashedUUID) {
        return hashedUUID;
    } else {
        throw { code: "permission_denied" };
    }
};

export const encrypted = (message: string, key: string) => {
    return CryptoES.AES.encrypt(message, key).toString();
};

export const decrypted = (ciphertext: any, key: string) => {
    return CryptoES.AES.decrypt(ciphertext, key).toString(CryptoES.enc.Utf8);
};
