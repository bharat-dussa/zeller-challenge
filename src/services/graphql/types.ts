import { UserRole } from "../api/users/user.models";

export type ZellerCustomer = {
  id: string;
  name?: string;
  email?: string | null;
  role?: UserRole;
};

export type ZellerCustomerConnection = {
  items: ZellerCustomer[];
  nextToken?: string | null;
};

export type UserListItemVM = {
  id: string;
  name: string;
  role: string;
  letter: string;
};