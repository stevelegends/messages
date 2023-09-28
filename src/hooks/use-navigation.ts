// modules
import { NavigationProp, useNavigation as useRNavigation } from "@react-navigation/native";

// navigation
import { StackNavigatorParams } from "@navigation/main-navigator";

const useNavigation = () => useRNavigation<NavigationProp<StackNavigatorParams>>();

export default useNavigation;
