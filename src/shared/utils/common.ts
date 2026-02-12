import { UserListItemVM } from '../services/graphql/types';
import 'react-native-get-random-values';
import { v4 as uuidv4 } from 'uuid';
import { UserSection, UserItem } from '../../features/users/components/user-list.component';

export const ROLES = ['Admin', 'Manager'] as const;
export const TABS = ['All', ...ROLES] as const;

export const buildSections = (data: UserListItemVM[]): UserSection[] => {
  const sorted = [...data].sort((a, b) =>
    a.name.localeCompare(b.name, undefined, { sensitivity: 'base' }),
  ) as UserSection['data'];

  const map: Record<string, UserItem[]> = {};

  sorted.forEach(user => {
    const letter = user?.name?.charAt(0).toUpperCase();

    if (letter && !map[letter]) {
      map[letter] = [];
    }

    letter && map[letter].push({
      id: user?._id || user.id,
      name: user.name,
      role: user.role,
      email: user.email,
    });
  });

  return Object.keys(map)
    .sort()
    .map(letter => ({
      title: letter,
      data: map[letter],
    }));
};


export const getRandomUuid = () => uuidv4();
