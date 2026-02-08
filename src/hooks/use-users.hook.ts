import { useEffect, useMemo, useState } from 'react';
import { userRepository } from '../services/api/users/repository/user.repository';
import {
  filterUsersByRole,
  mapUsersToListItems,
  searchUsersByName,
} from '../services/api/users/user.logic';
import { UserRole } from '../services/api/users/user.models';
import { ZellerCustomer } from '../services/graphql/types';

export const useUsers = (role?: UserRole & 'All', searchQuery: string = '') => {
  const [users, setUsers] = useState<ZellerCustomer[]>([]);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);


  

  const loadUsers = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await userRepository.getUsers();

      console.log('data', data);
      setUsers(data);
    } catch {
      setError('Unable to load users');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadUsers();
  }, []);

  const listItems = useMemo(() => {
    const filtered = searchUsersByName(
      filterUsersByRole(users, role),
      searchQuery,
    );
    return mapUsersToListItems(filtered);
  }, [role, searchQuery, users]);

  const onRefresh = async () => {
    setRefreshing(true);
    try {
      const data = await userRepository.forceSync();
      setUsers(data);
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (err) {
      setError(String(err?.message || ''));
    } finally {
      setRefreshing(false);
    }
  };

  return {
    users: listItems,
    loading,
    error,
    reload: loadUsers,
    onRefresh,
    refreshing,
  };
};
