import { UserListItemVM } from '../services/graphql/types';
import { UserItem, UserSection } from './types';

export const ROLES = ['Admin', 'Manager'];
export const TABS = ['All', ...ROLES];

export const buildSections = (data: UserListItemVM[]): UserSection[] => {
  const sorted = [...data].sort((a, b) =>
    a.name.localeCompare(b.name, undefined, { sensitivity: 'base' }),
  );

  const map: Record<string, UserItem[]> = {};

  sorted.forEach(user => {
    const letter = user.name.charAt(0).toUpperCase();

    if (!map[letter]) {
      map[letter] = [];
    }

    map[letter].push({
      id: user._id || user.id,
      name: user.name,
      role: user.role,
    });
  });

  return Object.keys(map)
    .sort()
    .map(letter => ({
      title: letter,
      data: map[letter],
    }));
};
