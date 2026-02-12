import {
  USER_ROLES,
  USER_ROLES_WITH_ALL,
} from '../../../../../src/shared/models/user.models';
import { ROLES } from '../../../../../src/shared/utils/common';

test('user.models exports expected runtime role constants', () => {
  expect(USER_ROLES).toEqual(ROLES);
  expect(USER_ROLES_WITH_ALL).toEqual(['All', ...ROLES]);
});
