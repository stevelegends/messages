import { StyleSheet } from "react-native";

// theme
import { AppSize } from "@theme/theme";

const styles = StyleSheet.create({
    container: {
        flex: 1
    },
    closeButton: {
        width: 50,
        aspectRatio: 1,
        justifyContent: "center"
    },
    buttonWrap: {
        position: "absolute",
        right: 0,
        padding: AppSize.paddingButton
    },
    imageView: {
        width: "100%",
        height: "100%"
    }
});

export default styles;
