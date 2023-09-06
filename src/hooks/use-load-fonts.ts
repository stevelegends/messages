// react
import {useCallback} from "react";

// modules
import Font, {useFonts} from "expo-font";

// constants
import FontMap from "../constants/font-map";

const useLoadFonts = () => {
    const [fontsLoaded, fontError] = useFonts(FontMap);
    return {fontsLoaded, fontError}
}

export default useLoadFonts
