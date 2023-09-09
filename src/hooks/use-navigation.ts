// modules
import { StackNavigatorParams } from "@navigation/navigation";
import { NavigationProp, useNavigation as useRNavigation } from "@react-navigation/native";

const useNavigation = () => useRNavigation<NavigationProp<StackNavigatorParams>>();

export default useNavigation;
