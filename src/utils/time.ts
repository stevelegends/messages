import { i18n } from "@lingui/core";
import { msg } from "@lingui/macro";

export const onFormatDateTimeString = (time?: string): string => {
    if (!time) {
        return "";
    }
    const dateString = new Date(time).toLocaleDateString();
    const timeString = new Date(time).toLocaleTimeString();

    if (new Date(time).toLocaleDateString() !== new Date().toLocaleDateString()) {
        return dateString + ", " + timeString;
    }
    return i18n._(msg`Today`) + ", " + timeString;
};
