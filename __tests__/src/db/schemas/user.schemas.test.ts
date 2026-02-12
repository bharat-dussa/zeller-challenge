import { UserEntity } from '../../../../src/shared/db/schemas/user.schemas';

describe('db/schemas/user.schemas', () => {
  test('defines schema', () => {
    expect(UserEntity.schema.name).toBe('User');
    expect(UserEntity.schema.primaryKey).toBe('_id');
    expect(UserEntity.schema.properties).toMatchObject({
      _id: 'string',
      name: 'string',
      role: 'string',
    });
  });
});
