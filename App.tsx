// import initialize
import "react-native-gesture-handler";

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

const App = () => {
    return (
        <AppLoader style={globalStyles["flex-1"]}>
            <ThemeProvider>
                <Navigation />
            </ThemeProvider>
        </AppLoader>
    );
};

export default App;
