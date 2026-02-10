import {
  filterUsersByRole,
  mapUsersToListItems,
  searchUsersByName,
} from '../../../../../src/features/users/services/api/users/user.logic';

const users = [
  { id: '1', name: 'Alice', role: 'Admin', email: 'a@a.com' },
  { id: '2', name: 'Bob', role: 'Manager', email: 'b@a.com' },
];

describe('services/api/users/user.logic', () => {
  test('filters by role and All', () => {
    expect(filterUsersByRole(users as any, 'Admin')).toHaveLength(1);
    expect(filterUsersByRole(users as any, 'All' as any)).toHaveLength(2);
    expect(filterUsersByRole(users as any, undefined)).toHaveLength(2);
  });

  test('searches by name (case-insensitive)', () => {
    expect(searchUsersByName(users as any, 'al')).toHaveLength(1);
    expect(searchUsersByName(users as any, ' ')).toHaveLength(2);
  });

  test('maps to list items', () => {
    const mapped = mapUsersToListItems(users as any);
    expect(mapped[0]).toMatchObject({
      id: '1',
      name: 'Alice',
      role: 'Admin',
      letter: 'A',
      email: 'a@a.com',
    });
  });
});
