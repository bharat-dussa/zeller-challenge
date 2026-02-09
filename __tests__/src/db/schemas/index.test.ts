import { SCHEMA } from '../../../../src/db/schemas';
import { UserEntity } from '../../../../src/db/schemas/user.schemas';

describe('db/schemas/index', () => {
  test('exports schema list', () => {
    expect(SCHEMA).toEqual([UserEntity]);
  });
});
