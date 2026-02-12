import { RootStackParamList } from '../app/navigation/type';

declare global {
  namespace ReactNavigation {
    interface RootParamList extends NativeStackNavigationProp<RootStackParamList> {}
  }
}
