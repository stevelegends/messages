import React, { FC, Fragment, memo, useCallback } from "react";

// components
import PopupView from "./popup-view";

// contexts
import { useNotificationProvider } from "@contexts/notification-context";

const NotificationPopup: FC<any> = memo(function NotificationPopup() {
    const { stacks, removeStack } = useNotificationProvider();

    const handlePopupOnPress = useCallback(id => {
        removeStack(id);
    }, []) as (id: string) => void;

    return (
        <Fragment>
            {stacks.map(({ key, status, message, title, timeout }, index) => {
                return (
                    <PopupView
                        key={key}
                        id={key}
                        index={index}
                        status={status}
                        title={title}
                        message={message}
                        onPress={handlePopupOnPress}
                        timeout={timeout}
                    />
                );
            })}
        </Fragment>
    );
});

export default NotificationPopup;
