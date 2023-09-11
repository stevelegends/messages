import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
    container: {
        flex: 1
    },
    inputContainer: {
        flexDirection: "row",
        paddingVertical: 8,
        paddingHorizontal: 10,
        height: 50
    },
    textBox: {
        flex: 1,
        borderWidth: 1,
        borderRadius: 50,
        marginHorizontal: 15,
        paddingHorizontal: 12
    },
    mediaButton: {
        justifyContent: "center",
        alignItems: "center",
        width: 35
    },
    sendButton: {
        borderRadius: 50,
        padding: 8
    }
});

export default styles;
