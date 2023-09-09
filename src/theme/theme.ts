import { Dimensions, StyleSheet } from "react-native";

const DimensionScreen = Dimensions.get("screen");
const DimensionsWindow = Dimensions.get("window");

export const globalStyles = StyleSheet.create({
    "flex-1": {
        flex: 1
    },
    "flex-center": {
        justifyContent: "center",
        alignItems: "center"
    },
    "flex-1-center": {
        flex: 1,
        justifyContent: "center",
        alignItems: "center"
    },
    horizontal: {
        flexDirection: "row"
    },
    "horizontal-center": {
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center"
    },
    "marginL-5": {
        marginLeft: 5
    },
    "marginL-10": {
        marginLeft: 10
    },
    "marginL-15": {
        marginLeft: 15
    },
    "marginR-5": {
        marginRight: 5
    },
    "marginR-10": {
        marginRight: 10
    },
    "marginR-15": {
        marginRight: 15
    },
    "paddingL-5": {
        paddingRight: 5
    },
    "paddingL-10": {
        paddingRight: 10
    },
    "paddingL-15": {
        paddingRight: 15
    },
    "paddingR-5": {
        paddingRight: 5
    },
    "paddingR-10": {
        paddingRight: 10
    },
    "paddingR-15": {
        paddingRight: 15
    }
    // TODO add more
});

export const globalSize = {
    screenWidth: DimensionScreen.width,
    screenHeight: DimensionScreen.height,
    windowHeight: DimensionsWindow.height,
    windowWidth: DimensionsWindow.width
};
