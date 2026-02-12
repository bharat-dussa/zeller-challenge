import {
  createEncryptedRealmConfig,
  REALM_PATH,
  SCHEMA_VERSION,
} from '../../../src/shared/db/realConfig';
import { SCHEMA } from '../../../src/shared/db/schemas';
import { getOrCreateKey } from '../../../src/shared/db/secureKey';

jest.mock('../../../src/shared/db/secureKey', () => ({
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
