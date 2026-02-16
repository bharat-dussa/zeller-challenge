import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { ROUTES } from '../../shared/utils/route';
import UserListScreen from '../../features/users/screens/user-list.screen';
import React from 'react';

const Stack = createNativeStackNavigator();

export function RootNavigator() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen
        name={ROUTES.userListScreen}
        component={UserListScreen}
      />
      <Stack.Screen
        name={ROUTES.addUserScreen}
        getComponent={() =>
          require('../../features/users/screens/add-user.screen').default
        }
      />
    </Stack.Navigator>
  );
}
