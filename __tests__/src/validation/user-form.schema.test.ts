import { addUserSchema } from '../../../src/features/users/validation/user-form.schema';

describe('validation/user-form.schema', () => {
  test('accepts valid data', () => {
    const result = addUserSchema.safeParse({
      firstName: 'Jane',
      lastName: 'Doe',
      email: 'jane@doe.com',
      roleIndex: 0,
    });
    expect(result.success).toBe(true);
  });

  test('rejects invalid data', () => {
    const result = addUserSchema.safeParse({
      firstName: '',
      lastName: '123',
      email: 'bad-email',
      roleIndex: 0,
    });
    expect(result.success).toBe(false);
  });
});
