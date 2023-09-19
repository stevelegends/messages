import { Alert } from "react-native";
import { i18n } from "@lingui/core";
import { msg } from "@lingui/macro";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as SecureStore from "expo-secure-store";

// Define a type for your keys
type StorageKey = "userData";

export const storeData = async (key: StorageKey, value: string) => {
    try {
        await AsyncStorage.setItem(key, value);
    } catch (error: any) {
        Alert.alert(i18n._(msg`An error occurred`), error.message);
    }
};

export const getData = async (key: StorageKey) => {
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

export const clearAllData = async () => {
    await AsyncStorage.clear();
};

export const removeItemData = async (key: StorageKey) => {
    await AsyncStorage.removeItem(key);
};

export async function storeSecureData(key: StorageKey, value: string) {
    try {
        await SecureStore.setItemAsync(key, value, {});
    } catch (error: any) {
        Alert.alert(i18n._(msg`An error occurred`), error.message);
        await storeData(key, value);
    }
}

export async function getSecureData(key: StorageKey) {
    try {
        const value = await SecureStore.getItemAsync(key, {});
        if (value !== null) {
            return value;
        }
    } catch (error: any) {
        Alert.alert(i18n._(msg`An error occurred`), error.message);
        await getData(key);
    }
    return null;
}

export async function deleteSecureItem(key: StorageKey) {
    try {
        const value = await SecureStore.deleteItemAsync(key, {});
        if (value !== null) {
            return value;
        }
    } catch (error: any) {
        Alert.alert(i18n._(msg`An error occurred`), error.message);
        await removeItemData(key);
    }
    return null;
}
