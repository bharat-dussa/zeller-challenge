import Realm from 'realm';
import { ZellerCustomer } from '../graphql/types';
import { UserEntity } from '../../db/schemas/user.schemas';

export interface IRealmService {}

export const toRealmUser = (user: ZellerCustomer) => ({
  _id: user.id,
  name: user.name,
  firstName: user.firstName,
  lastName: user.lastName,
  email: user.email,
  role: user.role,
});

export const fromRealmUser = (u: UserEntity): ZellerCustomer => ({
  id: String(u._id),
  name: u.name,
  email: u.email,
  firstName: u.name,
  lastName: u.name,
  role: u.role,
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

  async createUser(data: ZellerCustomer): Promise< Omit<ZellerCustomer, 'id'>> {
    let created!: Omit<ZellerCustomer, 'id'>;
    this.realm.write(() => {
      created = this.realm.create('User', toRealmUser(data));
    });
    return created!;
  }

  async createMutliUsers(users: ZellerCustomer[]) {
    if (!users.length) return;

    this.realm.write(() => {
      users.forEach(user => {
        this.realm.create('User', toRealmUser(user), Realm.UpdateMode.Modified);
      });
    });
  }

  async updateUser(
    user: Partial<ZellerCustomer> & { id: string },
  ): Promise<void> {
    this.realm.write(() => {
      this.realm.create(
        'User',
        {
          _id: user.id,
          ...user,
        },
        Realm.UpdateMode.Modified,
      );
    });
  }

  async deleteUser(userId: string): Promise<void> {
    this.realm.write(() => {
      const user = this.realm.objectForPrimaryKey<UserEntity>('User', userId);

      if (user) {
        this.realm.delete(user);
      }
    });
  }

  async deleteUsers(userIds: string[]): Promise<void> {
    if (!userIds.length) return;

    this.realm.write(() => {
      userIds.forEach(id => {
        const user = this.realm.objectForPrimaryKey<UserEntity>('User', id);
        if (user) {
          this.realm.delete(user);
        }
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
