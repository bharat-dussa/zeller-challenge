import * as Keychain from 'react-native-keychain';
import { fromByteArray, toByteArray } from 'base64-js';

const KEYCHAIN_SERVICE = 'com.myapp.realm.key';
const KEYCHAIN_ACCOUNT = 'realm-encryption-key';

export async function getOrCreateKey(): Promise<ArrayBuffer> {
  const creds = await Keychain.getGenericPassword({
    service: KEYCHAIN_SERVICE,
  });
  if (creds) {
    return toByteArray(creds.password).buffer as ArrayBuffer;
  }

  const key = new Uint8Array(64);
  const b64 = fromByteArray(key);
  await Keychain.setGenericPassword(KEYCHAIN_ACCOUNT, b64, {
    service: KEYCHAIN_SERVICE,
  });
  return key.buffer;
}
