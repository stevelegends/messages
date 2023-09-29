// react
import React, {
    createContext,
    Dispatch,
    ReactElement,
    ReactNode,
    SetStateAction,
    useCallback,
    useContext,
    useState
} from "react";

// components
import { type StatusType } from "../components/notification-popup/popup-view";

// utils
import { generateUUID } from "@utils";

export type Notification = {
    status: StatusType;
    title: string;
    message: string;
    timeout?: number;
};

export type NotificationStack = {
    key: string;
} & Notification;

type NotificationContextType = {
    stacks: NotificationStack[];
    setStack: Dispatch<SetStateAction<NotificationStack[]>>;
    removeStack: (key: string) => void;
    addStack: (stack: Notification) => void;
};

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

function useNotificationProvider(): NotificationContextType {
    const context = useContext(NotificationContext);
    if (!context) {
        throw new Error("useNotification must be used within an ThemeProvider");
    }
    return context;
}

const NotificationProvider = (props: { children: ReactNode }): ReactElement => {
    const [stacks, setStack] = useState<NotificationStack[]>([]);

    const removeStack = useCallback(key => {
        setStack(prevState => prevState.filter(item => item.key !== key));
    }, []) as (key: string) => void;

    const addStack = useCallback(stack => {
        setStack(prevState => {
            return [
                ...prevState,
                {
                    key: generateUUID(),
                    status: stack.status,
                    title: stack.title,
                    message: stack.message,
                    timeout: stack.timeout
                }
            ];
        });
    }, []) as (stack: Notification) => void;

    return (
        <NotificationContext.Provider
            {...props}
            value={{ stacks, setStack, removeStack, addStack }}
        />
    );
};

export { NotificationProvider, useNotificationProvider };
