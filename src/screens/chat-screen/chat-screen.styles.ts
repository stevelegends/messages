import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
    container: {
        flex: 1
    },
    inputContainer: {
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center",
        paddingHorizontal: 10,
        paddingVertical: 8,
        borderRadius: 5,
        marginHorizontal: 8
    },
    textBox: {
        flex: 1,
        marginHorizontal: 15,
        paddingHorizontal: 12,
        paddingVertical: 8
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
