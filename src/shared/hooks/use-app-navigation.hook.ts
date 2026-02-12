import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "../../app/navigation/type";

export const useAppNavigation = () =>
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  