import { ROLES } from '../utils/common';

export const USER_ROLES = ROLES;
export const USER_ROLES_WITH_ALL = ['All', ...ROLES] as const;

export type UserRole = (typeof USER_ROLES)[number];
export type UserRoleWithAll = (typeof USER_ROLES_WITH_ALL)[number];
