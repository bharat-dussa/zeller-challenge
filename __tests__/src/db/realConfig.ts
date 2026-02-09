import Realm from 'realm';
import { SCHEMA } from './schemas';
import { getOrCreateKey } from './secureKey';

export const REALM_PATH = 'zeller.realm';
export const SCHEMA_VERSION = 2;

export async function createEncryptedRealmConfig(): Promise<Realm.Configuration> {
  const key = await getOrCreateKey();
  return {
    path: REALM_PATH,
    schema: SCHEMA,
    schemaVersion: SCHEMA_VERSION,
    encryptionKey: key
  };
}
