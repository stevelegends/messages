// import initialize
import "react-native-gesture-handler";

// react
import React from "react";

// modules
import { SafeAreaProvider } from "react-native-safe-area-context";

// navigation
import Navigation from "./src/navigation/navigation";

// hoc
import AppLoader from "@hoc/app-loader";

// theme
import { globalStyles } from "@theme/theme";

// contexts
import { ThemeProvider } from "@contexts/theme-context";

const App = () => {
    return (
        <SafeAreaProvider>
            <AppLoader style={globalStyles["flex-1"]}>
                <ThemeProvider>
                    <Navigation />
                </ThemeProvider>
            </AppLoader>
        </SafeAreaProvider>
    );
};

export default App;
