import React from 'react';
import AddUser from '../../components/add-user.component';
import { ZellerCustomer } from '../../services/graphql/types';
import { RouteProp, useRoute } from '@react-navigation/native';

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
