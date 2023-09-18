import AsyncStorage from "@react-native-async-storage/async-storage";

// Define a type for your keys
type StorageKey = "userData";

export const storeData = async (key: StorageKey, value: string) => {
    try {
        await AsyncStorage.setItem(key, value);
    } catch (error) {
        console.error("Error storing data:", error);
    }
};

export const getData = async (key: StorageKey) => {
    try {
        const value = await AsyncStorage.getItem(key);
        if (value !== null) {
            return value;
        }
    } catch (error) {
        console.error("Error retrieving data:", error);
    }
    return null;
};

export const clearAllData = async () => {
    await AsyncStorage.clear();
};
