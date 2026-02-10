import { fetchUsers } from '../../../../../src/features/users/services/api/users/user.api';
import { graphqlClient } from '../../../../../src/shared/services/api/graphqlClient';
import { LIST_ZELLER_CUSTOMERS } from '../../../../../src/shared/services/graphql/queries';

jest.mock('../../../../../src/shared/services/api/graphqlClient', () => ({
  graphqlClient: { request: jest.fn() },
}));

const requestMock = graphqlClient.request as jest.Mock;

describe('services/api/users/user.api', () => {
  beforeEach(() => {
    requestMock.mockReset();
  });

  test('returns items from graphql request', async () => {
    requestMock.mockResolvedValue({
      listZellerCustomers: {
        items: [{ id: '1', name: 'A', role: 'Admin', email: 'a@a.com' }],
      },
    });

    const result = await fetchUsers();

    expect(requestMock).toHaveBeenCalledWith(LIST_ZELLER_CUSTOMERS);
    expect(result).toHaveLength(1);
  });

  test('returns empty array when items missing', async () => {
    requestMock.mockResolvedValue({
      listZellerCustomers: {
        items: null,
      },
    });

    const result = await fetchUsers();
    expect(result).toEqual([]);
  });
});
