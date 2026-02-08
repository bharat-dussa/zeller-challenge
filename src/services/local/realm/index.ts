import Realm from 'realm';
import { UserEntity } from './schemas/user.schema';

export const realm = new Realm({
  schema: [UserEntity],
  schemaVersion: 1,
});

