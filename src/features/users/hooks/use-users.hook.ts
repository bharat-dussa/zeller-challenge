import { useCallback, useEffect, useMemo, useState } from 'react';
import {
  useQuery,
  useRealmService,
} from '../../../app/providers/realm-service.context';
import { UserEntity } from '../../../shared/db/schemas/user.schemas';
import { UserRoleWithAll } from '../../../shared/models/user.models';
import { fromRealmUser } from '../../../shared/services/realm/realm-service';
import { t } from '../../../shared/utils/t';
import { fetchUsers } from '../services/api/users/user.api';
import {
  filterUsersByRole,
  mapUsersToListItems,
  searchUsersByName,
} from '../services/api/users/user.logic';

export const useUsers = (role?: UserRoleWithAll, searchQuery: string = '') => {
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const dbUsers = useQuery(UserEntity);
  const service = useRealmService();

  const loadUsers = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const remoteUsers = await fetchUsers();
      service.createMutliUsers(remoteUsers);
    } catch {
      setError(t.error['load-users']);
    } finally {
      setLoading(false);
    }
  }, [service]);

  useEffect(() => {
    loadUsers();
  }, [loadUsers]);

  const listItems = useMemo(() => {
    const modifiedUsers = dbUsers?.map(u => fromRealmUser(u));
    const filtered = searchUsersByName(
      filterUsersByRole(modifiedUsers, role),
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
      setError(err instanceof Error ? err.message : t.error['something-went-wrong']);
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
