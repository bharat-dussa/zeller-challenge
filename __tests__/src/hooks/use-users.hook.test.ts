import { act, renderHook, waitFor } from '@testing-library/react-native';
import { useUsers } from '../../../src/features/users/hooks/use-users.hook';
import { fetchUsers } from '../../../src/features/users/services/api/users/user.api';
import {
  useQuery,
  useRealmService,
} from '../../../src/app/providers/realm-service.context';
import { t } from '../../../src/shared/utils/t';

jest.mock('../../../src/app/providers/realm-service.context', () => ({
  useQuery: jest.fn(),
  useRealmService: jest.fn(),
}));

jest.mock('../../../src/features/users/services/api/users/user.api', () => ({
  fetchUsers: jest.fn(),
}));

describe('hooks/use-users', () => {
  const createMutliUsers = jest.fn();

  beforeEach(() => {
    (useQuery as jest.Mock).mockReturnValue([
      { id: '1', name: 'Alice', role: 'Admin', email: 'a@a.com' },
      { id: '2', name: 'Bob', role: 'Manager', email: 'b@a.com' },
    ]);
    (useRealmService as jest.Mock).mockReturnValue({ createMutliUsers });
    (fetchUsers as jest.Mock).mockResolvedValue([
      { id: '3', name: 'Cara', role: 'Admin', email: 'c@a.com' },
    ]);
    createMutliUsers.mockClear();
    (fetchUsers as jest.Mock).mockClear();
  });

  test('loads users on mount and maps list by role', async () => {
    const { result } = renderHook(() => useUsers('Admin', ''));

    await waitFor(() => {
      expect(fetchUsers).toHaveBeenCalledTimes(1);
    });

    expect(createMutliUsers).toHaveBeenCalledWith([
      { id: '3', name: 'Cara', role: 'Admin', email: 'c@a.com' },
    ]);
    expect(result.current.users).toHaveLength(1);
    expect(result.current.users[0].name).toBe('Alice');
  });

  test('deduplicates initial sync when multiple tab instances mount together', async () => {
    (useQuery as jest.Mock).mockReturnValue([]);

    renderHook(() => useUsers());
    renderHook(() => useUsers('Admin'));
    renderHook(() => useUsers('Manager'));

    await waitFor(() => {
      expect(fetchUsers).toHaveBeenCalledTimes(1);
    });

    expect(createMutliUsers).toHaveBeenCalledTimes(1);
  });

  test('sets default error on initial load failure', async () => {
    (fetchUsers as jest.Mock).mockRejectedValueOnce(new Error('fail'));

    const { result } = renderHook(() => useUsers());

    await waitFor(() => {
      expect(result.current.error).toBe(t.error['load-users']);
    });
  });

  test('refreshes users and resets refreshing state', async () => {
    const { result } = renderHook(() => useUsers());

    await waitFor(() => {
      expect(fetchUsers).toHaveBeenCalledTimes(1);
    });

    await act(async () => {
      await result.current.onRefresh();
    });

    expect(fetchUsers).toHaveBeenCalledTimes(2);
    expect(createMutliUsers).toHaveBeenCalledTimes(2);
    expect(result.current.refreshing).toBe(false);
  });

  test('sets refresh error message when refresh fails', async () => {
    (fetchUsers as jest.Mock)
      .mockResolvedValueOnce([{ id: '3', name: 'Cara', role: 'Admin', email: 'c@a.com' }])
      .mockRejectedValueOnce(new Error('network down'));

    const { result } = renderHook(() => useUsers());

    await waitFor(() => {
      expect(fetchUsers).toHaveBeenCalledTimes(1);
    });

    await act(async () => {
      await result.current.onRefresh();
    });

    expect(result.current.error).toBe('network down');
    expect(result.current.refreshing).toBe(false);
  });

  test('sets refresh error default message when refresh fails', async () => {
    (fetchUsers as jest.Mock)
      .mockResolvedValueOnce([{ id: '3', name: 'Cara', role: 'Admin', email: 'c@a.com' }])
      .mockRejectedValueOnce(undefined);

    const { result } = renderHook(() => useUsers());

    await waitFor(() => {
      expect(fetchUsers).toHaveBeenCalledTimes(1);
    });

    await act(async () => {
      await result.current.onRefresh();
    });

    expect(result.current.error).toBe(t.error['something-went-wrong']);
    expect(result.current.refreshing).toBe(false);
  });
});
