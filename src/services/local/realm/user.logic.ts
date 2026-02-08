import { realm } from '.';
import Realm from 'realm';
import { ZellerCustomer } from '../../graphql/types';
import { UserEntity } from './schemas/user.schema';

const toRealmUser = (user: ZellerCustomer) => ({
  _id: user.id,
  name: user.name,
  email: user.email,
  role: user.role,
});

const fromRealmUser = (u: UserEntity): ZellerCustomer => ({
  id: u._id,
  name: u.name,
  email: u.email,
  role: u.role as ZellerCustomer['role'],
});

export const getUsersLocal = (): ZellerCustomer[] => {
  if (realm.isClosed) {
    return [];
  }
  const users = realm.objects<UserEntity>('User');
  return users.map(fromRealmUser);
};

export const saveUsersLocal = (users: ZellerCustomer[]) => {
  if (!users.length) return;

  realm.write(() => {
    users.forEach(user => {
      realm.create('User', toRealmUser(user), Realm.UpdateMode.Modified);
    });
  });
};

export const clearUsersLocal = () => {
  realm.write(() => {
    const users = realm.objects('User');
    realm.delete(users);
  });
};
