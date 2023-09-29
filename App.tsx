// import initialize
import "react-native-gesture-handler";

// services
import "@services/firebase-app";

// react
import React from "react";

// navigation
import Navigation from "./src/navigation/navigation";

// hoc
import AppLoader from "@hoc/app-loader";

// theme
import { globalStyles } from "@theme/theme";

// contexts
import { ThemeProvider } from "@contexts/theme-context";
import { NotificationProvider } from "@contexts/notification-context";

// utils
import { splashScreenPreventAutoHideAsync } from "@utils";

splashScreenPreventAutoHideAsync();

const App = () => {
    return (
        <AppLoader style={globalStyles["flex-1"]}>
            <ThemeProvider>
                <NotificationProvider>
                    <Navigation />
                </NotificationProvider>
            </ThemeProvider>
        </AppLoader>
    );
};

export default App;
