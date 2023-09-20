import { i18n } from "@lingui/core";
import { Alert } from "react-native";
import { msg } from "@lingui/macro";

// utils
import ErrorMessage from "./error-message";

// store
import { onLogout } from "@store/store-action";

const ErrorHandler = (error: any) => {
    const errorMessage = error.message?.toLowerCase() || "";
    if (errorMessage.includes("permission_denied")) {
        Alert.alert(i18n._(msg`Session Expired`), i18n._(msg`Please sign in again.`), [
            { text: i18n._(msg`Ok`) }
        ]);
        onLogout();
        return;
    }
    const message = ErrorMessage[error.code as keyof typeof ErrorMessage]
        ? i18n._(ErrorMessage[error.code as keyof typeof ErrorMessage])
        : error.message;
    Alert.alert(i18n._(msg`An error occurred`), message, [{ text: i18n._(msg`Ok`) }]);
};

export default ErrorHandler;
