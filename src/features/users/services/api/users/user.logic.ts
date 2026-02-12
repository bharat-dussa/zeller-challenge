import { UserRoleWithAll } from '../../../../../shared/models/user.models';
import { ZellerCustomer } from '../../../../../shared/services/graphql/types';

export const filterUsersByRole = (
  users: ZellerCustomer[],
  role?: UserRoleWithAll
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
): ZellerCustomer[] => {
  return users.map(user => ({
    id: user?._id || user.id || '',
    name: String(user.name) || '',
    role: user.role || '',
    email: user.email,
    letter: String(user?.name?.charAt(0).toUpperCase()),
  }));
};
