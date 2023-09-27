// modules
import { useNavigation as useRNavigation } from "@react-navigation/native";

// navigation
import { BottomTabStackNavigatorParams } from "@navigation/bottom-tab-navigation";
import { BottomTabNavigationProp } from "@react-navigation/bottom-tabs";

const useTabNavigation = () =>
    useRNavigation<BottomTabNavigationProp<BottomTabStackNavigatorParams>>();

export default useTabNavigation;
