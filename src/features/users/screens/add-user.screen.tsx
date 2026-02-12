import React from 'react';
import AddUser from '../components/add-user.component';
import { RouteProp, useRoute } from '@react-navigation/native';
import { ZellerCustomer } from '../../../shared/services/graphql/types';

type AddUserRouteParams = {
  user?: ZellerCustomer;
};

const AddUserScreen = () => {
  const route =
    useRoute<RouteProp<Record<string, AddUserRouteParams>, string>>();
  const editingUser = route?.params?.user;
  const isEditMode = Boolean(editingUser);

  return <AddUser isEditMode={isEditMode} user={editingUser} />;
};

export default AddUserScreen;
