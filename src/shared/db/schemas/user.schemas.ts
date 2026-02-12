import { Realm } from '@realm/react';
import { ZellerCustomer } from '../../services/graphql/types';


export class UserEntity extends Realm.Object<UserEntity>  {
  _id!: ZellerCustomer['_id'];
  name!: ZellerCustomer['name'];
  email?: ZellerCustomer['email'] 
  role!: ZellerCustomer['role'];

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
