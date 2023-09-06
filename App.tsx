// modules
import Entypo from "@expo/vector-icons/Entypo";
import { Text } from "react-native";

// hoc
import AppLoader from "./src/HOC/AppLoader";

const App = () => {
  return (
    <AppLoader
      style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
    >
      <Text style={{ fontSize: 20, fontFamily: "Roboto-Light" }}>
        let's get started! <Entypo name="rocket" size={30} />
      </Text>
    </AppLoader>
  );
};

export default App;
