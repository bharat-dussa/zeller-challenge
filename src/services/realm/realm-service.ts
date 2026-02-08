import Realm from 'realm';
import { ZellerCustomer } from '../graphql/types';
import { UserEntity } from '../../db/schemas/user.schemas';

export interface IRealmService {}

export const toRealmUser = (user: ZellerCustomer) => ({
  _id: user.id,
  name: user.name,
  email: user.email,
  role: user.role,
});

export const fromRealmUser = (u: UserEntity): ZellerCustomer => ({
  id: u._id,
  name: u.name,
  email: u.email,
  role: u.role as ZellerCustomer['role'],
});

export class RealmService implements IRealmService {
  public realm: Realm;

  constructor(realmInstance: Realm) {
    this.realm = realmInstance;
  }

  static async open(realmConfig: Realm.Configuration): Promise<RealmService> {
    const r = await Realm.open(realmConfig);
    return new RealmService(r);
  }

  static fromRealm(realmInstance: Realm) {
    return new RealmService(realmInstance);
  }

  async createUser(data: ZellerCustomer): Promise<ZellerCustomer> {
    let created!: ZellerCustomer;
    this.realm.write(() => {
      //@ts-ignore
      created = this.realm.create('User', toRealmUser(data));
    });
    return created!;
  }

  async createMutliUsers(users: ZellerCustomer[]) {
    if (!users.length) [];

    this.realm.write(() => {
      users.forEach(user => {
        this.realm.create('User', toRealmUser(user), Realm.UpdateMode.Modified);
      });
    });
  }

  async getUsersLocal(): Promise<ZellerCustomer[]> {
    if (this.realm.isClosed) {
      return [];
    }
    const users = this.realm.objects<UserEntity>('User');
    return users.map(fromRealmUser);
  }

  close() {
    if (!this.realm.isClosed) this.realm.close();
  }
}
