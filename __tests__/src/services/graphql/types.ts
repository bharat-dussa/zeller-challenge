import { UserRole } from "../api/users/user.models";

export type ZellerCustomer = {
  _id?: string;
  id: string;
  name?: string;
  email?: string | null;
  role?: UserRole;
  firstName?: string;
  lastName?: string;
};

export type ZellerCustomerConnection = {
  items: ZellerCustomer[];
  nextToken?: string | null;
};

export type UserListItemVM = {
  _id: string;
  id: string;
  name: string;
  role: string;
  letter: string;
  email: string;
};