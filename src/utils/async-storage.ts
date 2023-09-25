import { Alert } from "react-native";
import { i18n } from "@lingui/core";
import { msg } from "@lingui/macro";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as SecureStore from "expo-secure-store";

// Define a type for your keys
type StorageKey = "userData" | "unitKey";

export const setItemAsyncStorage = async (key: StorageKey, value: string) => {
    try {
        await AsyncStorage.setItem(key, value);
    } catch (error: any) {
        Alert.alert(i18n._(msg`An error occurred`), error.message);
    }
};

export const getItemAsyncStorage = async (key: StorageKey) => {
    try {
        const value = await AsyncStorage.getItem(key);
        if (value !== null) {
            return value;
        }
    } catch (error: any) {
        Alert.alert(i18n._(msg`An error occurred`), error.message);
    }
    return null;
};

export const clearAsyncStorage = async () => {
    await AsyncStorage.clear();
};

export const removeItemAsyncStorage = async (key: StorageKey) => {
    await AsyncStorage.removeItem(key);
};

export async function setItemAsyncSecureStore(key: StorageKey, value: string) {
    try {
        await SecureStore.setItemAsync(key, value, {});
    } catch (error: any) {
        Alert.alert(i18n._(msg`An error occurred`), error.message);
        await setItemAsyncStorage(key, value);
    }
}

export async function getItemAsyncSecureStore(key: StorageKey) {
    try {
        const value = await SecureStore.getItemAsync(key, {});
        if (value !== null) {
            return value;
        }
    } catch (error: any) {
        Alert.alert(i18n._(msg`An error occurred`), error.message);
        await getItemAsyncStorage(key);
    }
    return null;
}

export async function deleteItemAsyncSecureStore(key: StorageKey) {
    try {
        const value = await SecureStore.deleteItemAsync(key, {});
        if (value !== null) {
            return value;
        }
    } catch (error: any) {
        Alert.alert(i18n._(msg`An error occurred`), error.message);
        await removeItemAsyncStorage(key);
    }
    return null;
}
