import { getOrCreateKey } from '../../../src/db/secureKey';
import * as Keychain from 'react-native-keychain';
import { fromByteArray, toByteArray } from 'base64-js';

jest.mock('react-native-keychain', () => ({
  getGenericPassword: jest.fn(),
  setGenericPassword: jest.fn(),
}));

jest.mock('base64-js', () => ({
  fromByteArray: jest.fn(() => 'encoded'),
  toByteArray: jest.fn(() => new Uint8Array([1, 2, 3])),
}));

describe('db/secureKey', () => {
  beforeEach(() => {
    (Keychain.getGenericPassword as jest.Mock).mockReset();
    (Keychain.setGenericPassword as jest.Mock).mockReset();
    (fromByteArray as jest.Mock).mockClear();
    (toByteArray as jest.Mock).mockClear();
  });

  test('returns existing key when present', async () => {
    (Keychain.getGenericPassword as jest.Mock).mockResolvedValue({
      password: 'abc',
    });

    const key = await getOrCreateKey();

    expect(toByteArray).toHaveBeenCalledWith('abc');
    expect(Keychain.setGenericPassword).not.toHaveBeenCalled();
    expect(key).toBeInstanceOf(ArrayBuffer);
  });

  test('creates and stores key when missing', async () => {
    (Keychain.getGenericPassword as jest.Mock).mockResolvedValue(false);

    const key = await getOrCreateKey();

    const arg = (fromByteArray as jest.Mock).mock.calls[0][0];
    expect(arg).toBeInstanceOf(Uint8Array);
    expect(arg.length).toBe(64);
    expect(Keychain.setGenericPassword).toHaveBeenCalledWith(
      'realm-encryption-key',
      'encoded',
      { service: 'com.myapp.realm.key' },
    );
    expect(key).toBeInstanceOf(ArrayBuffer);
  });
});
