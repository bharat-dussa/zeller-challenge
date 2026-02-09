const mockWrite = jest.fn(fn => fn());
const mockCreate = jest.fn();
const mockDelete = jest.fn();
const mockObjects = jest.fn();
const mockObjectForPrimaryKey = jest.fn();

const RealmMock = jest.fn().mockImplementation(() => ({
  write: mockWrite,
  create: mockCreate,
  delete: mockDelete,
  objects: mockObjects,
  objectForPrimaryKey: mockObjectForPrimaryKey,
  close: jest.fn(),
  isClosed: false,
}));

RealmMock.open = jest.fn();

RealmMock.UpdateMode = {
  Modified: 'modified',
};

export default RealmMock;

export {
  mockWrite,
  mockCreate,
  mockDelete,
  mockObjects,
  mockObjectForPrimaryKey,
};
