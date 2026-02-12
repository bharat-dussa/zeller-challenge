import React from 'react';
import { fireEvent, render, screen } from '@testing-library/react-native';
import { UserList } from '../../../src/features/users/components/user-list.component';
import { ROUTES } from '../../../src/shared/utils/route';

const mockNavigate = jest.fn();
const mockOnRefresh = jest.fn();

let mockUsers: any[] = [];
let mockLoading = false;
let mockRefreshing = false;

jest.mock('../../../src/shared/hooks/use-app-navigation.hook', () => ({
  useAppNavigation: () => ({ navigate: mockNavigate }),
}));

jest.mock('../../../src/features/users/hooks/use-users.hook', () => ({
  useUsers: () => ({
    onRefresh: mockOnRefresh,
    refreshing: mockRefreshing,
    users: mockUsers,
    loading: mockLoading,
  }),
}));

describe('components/UserList', () => {
  beforeEach(() => {
    mockUsers = [];
    mockLoading = false;
    mockRefreshing = false;
    mockNavigate.mockClear();
    mockOnRefresh.mockClear();
  });

  test('shows loader while loading', () => {
    mockLoading = true;

    render(<UserList role={'All' as any} />);

    expect(screen.getByTestId('loader-container')).toBeTruthy();
  });

  test('renders sections and triggers navigation on item press', () => {
    mockUsers = [
      { id: '1', _id: '1', name: 'Alice', role: 'Admin', email: 'a@a.com' },
      { id: '2', _id: '2', name: 'Bob', role: 'Manager', email: 'b@b.com' },
    ];

    render(<UserList role={'All' as any} />);

    expect(screen.getByTestId('user-list-section-A')).toBeTruthy();
    expect(screen.getByTestId('user-list-section-B')).toBeTruthy();

    expect(screen.getByTestId('user-list-item-role-1').props.children).toBe('Admin');
    expect(screen.queryByTestId('user-list-item-role-2')).toBeNull();

    fireEvent.press(screen.getByTestId('user-list-item-1'));

    expect(mockNavigate).toHaveBeenCalledWith(ROUTES.addUserScreen, {
      user: expect.objectContaining({ id: '1', name: 'Alice' }),
    });
  });

  test('renders empty state for no users', () => {
    mockUsers = [];

    render(<UserList role={'All' as any} />);

    expect(screen.getByTestId('no-data-container')).toBeTruthy();
    expect(screen.getByTestId('no-data-text').props.children).toBe('No Data');
  });
});
