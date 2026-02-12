import { SCHEMA } from '../../../../src/shared/db/schemas';
import { UserEntity } from '../../../../src/shared/db/schemas/user.schemas';

describe('db/schemas/index', () => {
  test('exports schema list', () => {
    expect(SCHEMA).toEqual([UserEntity]);
  });
});
