import { UserListItemVM, ZellerCustomer } from "../../graphql/types";
import { UserRole } from "./user.models";

export const filterUsersByRole = (
  users: ZellerCustomer[],
  role?: UserRole & 'All'
): ZellerCustomer[] => {
  if (!role) return users;
  if(role === 'All') return users;
  return users.filter(u => u.role === role);
};

export const searchUsersByName = (
  users: ZellerCustomer[],
  query: string
): ZellerCustomer[] => {
  if (!query.trim()) return users;

  const q = query.toLowerCase();
  return users.filter(u =>
    u?.name?.toLowerCase().includes(q)
  );
};

export const mapUsersToListItems = (
  users: ZellerCustomer[]
): UserListItemVM[] => {
  return users.map(user => ({
    id: user.id,
    name: String(user.name),
    role: String(user.role),
    letter: String(user?.name?.charAt(0).toUpperCase()),
  }));
};