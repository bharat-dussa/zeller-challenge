import { ZellerCustomer } from '../../shared/services/graphql/types';

export type RootStackParamList = {
  UserListScreen: undefined;
  AddUserScreen: undefined | {
    user?: ZellerCustomer;
    isEditMode?: boolean;
  };
};
