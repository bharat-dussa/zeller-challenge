import { ROUTES } from '../../../src/shared/utils/route';

describe('utils/route', () => {
  test('exports routes', () => {
    expect(ROUTES.userListScreen).toBe('UserListScreen');
    expect(ROUTES.addUserScreen).toBe('AddUserScreen');
  });
});
