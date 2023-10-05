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
    "flex-row": {
        flexDirection: "row"
    },
    "space-between": {
        justifyContent: "space-between"
    },
    "flex-1-center": {
        flex: 1,
        justifyContent: "center",
        alignItems: "center"
    },
    "flex-jc-center": {
        justifyContent: "center"
    },
    "align-self-center": {
        alignSelf: "center"
    },
    absolute: {
        position: "absolute"
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
    "marginT-5": {
        marginTop: 5
    },
    "marginT-8": {
        marginTop: 8
    },
    "marginT-10": {
        marginTop: 10
    },
    "marginT-20": {
        marginTop: 20
    },
    "marginT-40": {
        marginTop: 40
    },
    "marginT-50": {
        marginTop: 50
    },
    "marginT-25": {
        marginTop: 25
    },
    "marginT-30": {
        marginTop: 30
    },
    "marginB-5": {
        marginBottom: 5
    },
    "marginB-10": {
        marginBottom: 10
    },
    "marginB-20": {
        marginBottom: 20
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
    },
    "paddingH-20": {
        paddingHorizontal: 20
    },
    "paddingH-40": {
        paddingHorizontal: 40
    },
    "paddingV-20": {
        paddingVertical: 20
    },
    "paddingV-10": {
        paddingVertical: 10
    },
    "marginH-8": {
        marginHorizontal: 8
    },
    "marginH-5": {
        marginHorizontal: 5
    },
    "marginH-10": {
        marginHorizontal: 10
    },
    "marginH-20": {
        marginHorizontal: 20
    },
    "marginH-50": {
        marginHorizontal: 50
    },
    "marginV-50": {
        marginVertical: 50
    },
    "margin-8": {
        margin: 8
    },
    "marginV-8": {
        marginVertical: 8
    },
    "marginV-5": {
        marginVertical: 5
    },
    "marginH-14": {
        marginHorizontal: 14
    }
    // TODO add more
});

export const globalSize = {
    screenWidth: DimensionScreen.width,
    screenHeight: DimensionScreen.height,
    windowHeight: DimensionsWindow.height,
    windowWidth: DimensionsWindow.width,
    headerTitle: 25,
    button: 50,
    paddingButton: 15,
    box: 30,
    box40: 40,
    "space-8": 8
};

export const globalColor = {
    "black-0.9": "rgba(1,1,1, 0.9)",
    "black-2": "#2F3032",
    "white-1.0": "#FFFFFF",
    "white-0.5": "rgba(255,255,255,0.5)",
    "white-2": "#E5FAF6",
    white3: "#FDF8E8",
    "white-3e": "#EEEEFE",
    white: "rgb(255,255,255)",
    "light-grey-1": "#FDEEEE",
    "dark-grey": "#808080",
    "green-active": "#45CC99",
    "red-error": "#EB5757",
    "yellow-warn": "#F2C84C",
    "blue-info": "#5458F7"
};
