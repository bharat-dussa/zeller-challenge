import { ZellerCustomer } from '../../../graphql/types';
import { getUsersLocal, saveUsersLocal } from '../../../local/realm/user.logic';
import { syncUsers } from '../../../local/realm/user.sync';

export class UserRepository {
  async getUsers(): Promise<ZellerCustomer[]> {
    syncUsers().catch(() => {});

    return getUsersLocal();
  }

  async forceSync(): Promise<ZellerCustomer[]> {
    await syncUsers();
    return getUsersLocal();
  }

  async saveUsers(users: ZellerCustomer[]) {
    await saveUsersLocal(users)
  }
}

export const userRepository = new UserRepository();
