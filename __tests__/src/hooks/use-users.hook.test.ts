import React from 'react';
import ReactTestRenderer from 'react-test-renderer';
import { useUsers } from '../../../src/features/users/hooks/use-users.hook';
import { fetchUsers } from '../../../src/features/users/services/api/users/user.api';
import {
  useQuery,
  useRealmService,
} from '../../../src/app/providers/realm-service.context';

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
  });

  test('loads users on mount and maps list', async () => {
    let state: any;

    const HookTester = () => {
      state = useUsers('Admin', '');
      return null;
    };

    await ReactTestRenderer.act(async () => {
      ReactTestRenderer.create(React.createElement(HookTester));
      await Promise.resolve();
    });

    expect(fetchUsers).toHaveBeenCalled();
    expect(createMutliUsers).toHaveBeenCalled();
    expect(state.users).toHaveLength(1);
  });

  test('sets error on load failure', async () => {
    (fetchUsers as jest.Mock).mockRejectedValueOnce(new Error('fail'));
    let state: any;

    const HookTester = () => {
      state = useUsers();
      return null;
    };

    await ReactTestRenderer.act(async () => {
      ReactTestRenderer.create(React.createElement(HookTester));
      await Promise.resolve();
    });

    expect(state.error).toBe('Unable to load users');
  });

  test('onRefresh updates refreshing state', async () => {
    let state: any;

    const HookTester = () => {
      state = useUsers();
      return null;
    };

    await ReactTestRenderer.act(async () => {
      ReactTestRenderer.create(React.createElement(HookTester));
      await Promise.resolve();
    });

    await ReactTestRenderer.act(async () => {
      await state.onRefresh();
    });

    expect(createMutliUsers).toHaveBeenCalled();
    expect(state.refreshing).toBe(false);
  });

  test('onRefresh sets error message on failure', async () => {
    (fetchUsers as jest.Mock)
      .mockResolvedValueOnce([{ id: '3', name: 'Cara', role: 'Admin' }])
      .mockRejectedValueOnce(new Error('network down'));

    let state: any;

    const HookTester = () => {
      state = useUsers();
      return null;
    };

    await ReactTestRenderer.act(async () => {
      ReactTestRenderer.create(React.createElement(HookTester));
      await Promise.resolve();
    });

    await ReactTestRenderer.act(async () => {
      await state.onRefresh();
    });

    expect(state.error).toBe('network down');
    expect(state.refreshing).toBe(false);
  });
});
