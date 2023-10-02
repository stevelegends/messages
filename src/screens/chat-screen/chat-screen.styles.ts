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
        width: 35,
        aspectRatio: 1
    },
    sendButton: {
        width: 35,
        aspectRatio: 1,
        borderRadius: 35 / 2,
        justifyContent: "center",
        alignItems: "center"
    },
    separatorChatList: {
        height: 10
    }
});

export default styles;
