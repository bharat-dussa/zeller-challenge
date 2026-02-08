import { Realm } from '@realm/react';

export class UserEntity extends Realm.Object<UserEntity> {
  _id!: string;
  name!: string;
  email?: string;
  role!: string;

  static schema: Realm.ObjectSchema = {
    name: 'User',
    primaryKey: '_id',
    properties: {
      _id: 'string',
      name: 'string',
      email: 'string?',
      role: 'string',
    },
  };
}
