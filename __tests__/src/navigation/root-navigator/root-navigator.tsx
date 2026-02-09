import { createNativeStackNavigator } from '@react-navigation/native-stack';
import UserListScreen from '../../screens/user-list/user-list.screen';
import AddUserScreen from '../../screens/add-user/add-user.screen';
import { ROUTES } from '../../utils/route';

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
