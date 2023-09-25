import { StyleSheet } from "react-native";

// theme
import { globalSize } from "@theme/theme";

const styles = StyleSheet.create({
    container: {
        flex: 1
    },
    searchContainer: {
        height: globalSize.box40,
        marginVertical: 8,
        paddingHorizontal: 8,
        paddingVertical: 5,
        borderRadius: 5,
        flexDirection: "row",
        alignItems: "center"
    },
    searchBox: {
        marginLeft: 8,
        fontSize: 15,
        flex: 1
    },
    noResultText: {
        letterSpacing: 0.3
    },
    noResultIcon: {
        marginBottom: 8
    }
});

export default styles;
