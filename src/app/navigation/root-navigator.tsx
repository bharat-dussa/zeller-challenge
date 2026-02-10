import { createNativeStackNavigator } from '@react-navigation/native-stack';
import UserListScreen from '../../features/users/screens/user-list.screen';
import AddUserScreen from '../../features/users/screens/add-user.screen';
import { ROUTES } from '../../shared/utils/route';

const Stack = createNativeStackNavigator();

export function RootNavigator() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen name={ROUTES.userListScreen} component={UserListScreen} />
      <Stack.Screen
        name={ROUTES.addUserScreen}
        component={AddUserScreen}
        
      />
    </Stack.Navigator>
  );
}
