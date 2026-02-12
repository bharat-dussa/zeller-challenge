import { ROLES } from "../utils/common";

export type UserRole = typeof ROLES[number];
export type UserRoleWithAll = UserRole | 'All';
