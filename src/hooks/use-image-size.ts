import { useCallback } from "react";
import { Image } from "react-native";

// constants
import { Resolution } from "@constants/resolution";

const useImageSize = () => {
    const getImageOptimizedSize = useCallback((uri: string) => {
        return new Promise((resolve, reject) => {
            Image.getSize(uri, (width, height) => {
                let resizeWidth = width;

                if (width > Resolution.XGA[0]) {
                    const optimizeSize = resizeWidth / 3;
                    resizeWidth =
                        optimizeSize <= Resolution.XGA[0] ? Resolution.XGA[0] : optimizeSize;
                }

                resolve({ size: Math.floor(resizeWidth), origin: { width, height } });
            });
        });
    }, []) as (uri: string) => Promise<{ size: number; origin: { width: number; height: number } }>;
    return { getImageOptimizedSize };
};

export default useImageSize;
