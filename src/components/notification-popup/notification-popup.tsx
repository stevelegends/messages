import React, { FC, Fragment, memo, useCallback, useEffect } from "react";

// components
import PopupView from "./popup-view";

// contexts
import { useNotificationProvider } from "@contexts/notification-context";

const NotificationPopup: FC<any> = memo(function NotificationPopup() {
    const { stacks, removeStack } = useNotificationProvider();

    const handlePopupOnPress = useCallback(id => {
        removeStack(id);
    }, []) as (id: string) => void;

    // TODO implement auto close feature.
    // useEffect(() => {
    //     if (stacks.length > 0) {
    //         for (let i = 0; i < stacks.length; i++) {
    //             const stack = stacks[i];
    //             if (stack.timeout) {
    //                 setTimeout(() => {
    //                     removeStack(stack.key)
    //                 }, stack.timeout * ((stacks.length - i) <= 0 ? 1 : (stacks.length - i)))
    //             }
    //         }
    //     }
    // }, [stacks.length])

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
                    />
                );
            })}
        </Fragment>
    );
});

export default NotificationPopup;
