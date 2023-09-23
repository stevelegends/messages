import * as Device from "expo-device";

export const DeviceInfo = {
    brand: Device.brand, // Android: "google", "xiaomi"; iOS: "Apple"; web: null
    deviceName: Device.deviceName, // "Vivian's iPhone XS"
    type: Device.deviceType, // // UNKNOWN, PHONE, TABLET, TV, DESKTOP
    modelNam: Device.modelName, // // Android: "Pixel 2"; iOS: "iPhone XS Max"; web: "iPhone", null
    osVersion: Device.osVersion // Android: "4.0.3"; iOS: "12.3.1"; web: "11.0", "8.1.0"
};

export const isRootedExperimentalAsync = async () => {
    return Device.isRootedExperimentalAsync();
};
