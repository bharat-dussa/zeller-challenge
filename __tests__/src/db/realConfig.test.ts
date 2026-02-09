import {
  createEncryptedRealmConfig,
  REALM_PATH,
  SCHEMA_VERSION,
} from '../../../src/db/realConfig';
import { SCHEMA } from '../../../src/db/schemas';
import { getOrCreateKey } from '../../../src/db/secureKey';

jest.mock('../../../src/db/secureKey', () => ({
  getOrCreateKey: jest.fn(),
}));

describe('db/realConfig', () => {
  test('creates config with encryption key', async () => {
    const buf = new Uint8Array([1, 2]).buffer;
    (getOrCreateKey as jest.Mock).mockResolvedValue(buf);

    const config = await createEncryptedRealmConfig();

    expect(config).toEqual({
      path: REALM_PATH,
      schema: SCHEMA,
      schemaVersion: SCHEMA_VERSION,
      encryptionKey: buf,
    });
  });
});
