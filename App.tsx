import React from "react";

// modules
import Entypo from "@expo/vector-icons/Entypo";
import { Text } from "react-native";

// hoc
import AppLoader from "@hoc/app-loader";

const App = () => {
    return (
        <AppLoader style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
            <Text style={{ fontSize: 20, fontFamily: "Roboto-Light" }}>
                let get started! <Entypo name="rocket" size={30} />
            </Text>
        </AppLoader>
    );
};

export default App;
