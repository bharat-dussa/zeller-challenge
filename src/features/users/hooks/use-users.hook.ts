import { useEffect, useMemo, useState } from 'react';
import { useQuery, useRealmService } from '../../../app/providers/realm-service.context';
import { UserEntity } from '../../../shared/db/schemas/user.schemas';
import { fetchUsers } from '../services/api/users/user.api';
import {
  filterUsersByRole,
  mapUsersToListItems,
  searchUsersByName,
} from '../services/api/users/user.logic';
import { UserRole } from '../../../shared/models/user.models';
import { ZellerCustomer } from '../../../shared/services/graphql/types';

export const useUsers = (role?: UserRole & 'All', searchQuery: string = '') => {
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const dbUsers = useQuery(UserEntity);
  const service = useRealmService();

  const loadUsers = async () => {
    try {
      setLoading(true);
      setError(null);
      const remoteUsers = await fetchUsers();
      service.createMutliUsers(remoteUsers);
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
      filterUsersByRole(dbUsers as unknown as ZellerCustomer[], role),
      searchQuery,
    );
    return mapUsersToListItems(filtered);
  }, [dbUsers, role, searchQuery]);

  const onRefresh = async () => {
    setRefreshing(true);
    try {
      const remoteUsers = await fetchUsers();
      service.createMutliUsers(remoteUsers);
    } catch (err) {
      //@ts-ignore
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
