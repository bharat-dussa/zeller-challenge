import Realm from 'realm';
import {
  RealmService,
  fromRealmUser,
  toRealmUser,
} from '../../../../src/shared/services/realm/realm-service';

type RealmInstance = {
  write: jest.Mock;
  create: jest.Mock;
  delete: jest.Mock;
  objectForPrimaryKey: jest.Mock;
  objects: jest.Mock;
  close: jest.Mock;
  isClosed: boolean;
};

const mockRealmInstance: RealmInstance = {
  write: jest.fn((fn: () => void) => fn()),
  create: jest.fn(() => ({ id: 'created' })),
  delete: jest.fn(),
  objectForPrimaryKey: jest.fn(),
  objects: jest.fn(() => [
    { _id: '1', name: 'A', email: 'a@a.com', role: 'Admin' },
  ]),
  close: jest.fn(),
  isClosed: false,
};

describe('services/realm/realm-service', () => {
  beforeEach(() => {
    mockRealmInstance.write.mockClear();
    mockRealmInstance.create.mockClear();
    mockRealmInstance.delete.mockClear();
    mockRealmInstance.objectForPrimaryKey.mockClear();
    mockRealmInstance.objects.mockClear();
    mockRealmInstance.close.mockClear();
    mockRealmInstance.isClosed = false;
  });

  test('maps to and from realm user', () => {
    const user = {
      id: '1',
      name: 'A',
      firstName: 'Ann',
      lastName: 'A',
      email: 'a@a.com',
      role: 'Admin',
    };

    expect(toRealmUser(user as any)).toMatchObject({
      _id: '1',
      name: 'A',
      firstName: 'Ann',
      lastName: 'A',
      email: 'a@a.com',
      role: 'Admin',
    });

    expect(
      fromRealmUser({
        _id: '1',
        name: 'Bob',
        email: 'b@a.com',
        role: 'Manager',
      } as any),
    ).toMatchObject({
      id: '1',
      name: 'Bob',
      email: 'b@a.com',
      firstName: 'Bob',
      lastName: 'Bob',
      role: 'Manager',
    });
  });

  test('open and fromRealm return a service', async () => {
    const service = await RealmService.open({} as Realm.Configuration);
    expect(service).toBeInstanceOf(RealmService);
    expect(Realm.open).toHaveBeenCalled();

    const fromRealm = RealmService.fromRealm(mockRealmInstance as any);
    expect(fromRealm).toBeInstanceOf(RealmService);
  });

  test('creates user', async () => {
    const service = new RealmService(mockRealmInstance as any);
    const created = await service.createUser({ id: '1', name: 'A' } as any);
    expect(mockRealmInstance.write).toHaveBeenCalled();
    expect(mockRealmInstance.create).toHaveBeenCalledWith('User', expect.any(Object));
    expect(created).toEqual({ id: 'created' });
  });

  test('creates multiple users (empty and non-empty)', async () => {
    const service = new RealmService(mockRealmInstance as any);

    await service.createMutliUsers([]);
    expect(mockRealmInstance.write).not.toHaveBeenCalled();

    await service.createMutliUsers([
      { id: '1', name: 'A' },
      { id: '2', name: 'B' },
    ] as any);

    expect(mockRealmInstance.write).toHaveBeenCalled();
    expect(mockRealmInstance.create).toHaveBeenCalledWith(
      'User',
      expect.objectContaining({ _id: '1', name: 'A' }),
      'modified',
    );
  });

  test('updates and deletes users', async () => {
    const service = new RealmService(mockRealmInstance as any);
    await service.updateUser({ id: '1', name: 'B' });
    expect(mockRealmInstance.create).toHaveBeenCalledWith(
      'User',
      expect.objectContaining({ _id: '1', name: 'B' }),
      'modified',
    );

    mockRealmInstance.objectForPrimaryKey.mockReturnValue({ _id: '1' });
    await service.deleteUser('1');
    expect(mockRealmInstance.delete).toHaveBeenCalled();

    mockRealmInstance.objectForPrimaryKey.mockReturnValue(undefined);
    await service.deleteUser('2');
    expect(mockRealmInstance.delete).toHaveBeenCalledTimes(1);
  });

  test('deleteUsers handles empty and missing users', async () => {
    const service = new RealmService(mockRealmInstance as any);

    await service.deleteUsers([]);
    expect(mockRealmInstance.write).not.toHaveBeenCalled();

    mockRealmInstance.objectForPrimaryKey.mockReturnValueOnce({ _id: '1' });
    mockRealmInstance.objectForPrimaryKey.mockReturnValueOnce(undefined);
    await service.deleteUsers(['1', '2']);
    expect(mockRealmInstance.delete).toHaveBeenCalledTimes(1);
  });

  test('getUsersLocal returns empty when closed and maps users when open', async () => {
    const service = new RealmService(mockRealmInstance as any);

    mockRealmInstance.isClosed = true;
    const empty = await service.getUsersLocal();
    expect(empty).toEqual([]);

    mockRealmInstance.isClosed = false;
    const users = await service.getUsersLocal();
    expect(users[0]).toMatchObject({ id: '1', name: 'A' });
  });

  test('close only closes when not closed', () => {
    const service = new RealmService(mockRealmInstance as any);

    mockRealmInstance.isClosed = false;
    service.close();
    expect(mockRealmInstance.close).toHaveBeenCalledTimes(1);

    mockRealmInstance.isClosed = true;
    service.close();
    expect(mockRealmInstance.close).toHaveBeenCalledTimes(1);
  });
});
