import { addUserSchema } from '../../../src/features/users/validation/user-form.schema';

describe('validation/user-form.schema', () => {
  test('accepts valid data', () => {
    const result = addUserSchema.safeParse({
      firstName: 'Jane',
      lastName: 'Doe',
      email: 'jane@doe.com',
      role: 'Admin',
    });
    expect(result.success).toBe(true);
  });

  test('rejects invalid data', () => {
    const result = addUserSchema.safeParse({
      firstName: '',
      lastName: '123',
      email: 'bad-email',
      role: '',
    });
    expect(result.success).toBe(false);
  });
});
