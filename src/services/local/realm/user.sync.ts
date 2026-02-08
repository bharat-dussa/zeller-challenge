import { fetchUsers } from "../../api/users/user.api";
import { saveUsersLocal } from "./user.logic";

export const syncUsers = async () => {
  const remoteUsers = await fetchUsers();
  saveUsersLocal(remoteUsers);
};
