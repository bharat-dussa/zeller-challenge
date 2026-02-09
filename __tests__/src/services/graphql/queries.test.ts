import {
  LIST_ZELLER_CUSTOMERS,
  GET_ZELLER_CUSTOMER,
} from '../../../../src/services/graphql/queries';

describe('services/graphql/queries', () => {
  test('contains list query', () => {
    expect(LIST_ZELLER_CUSTOMERS).toContain('listZellerCustomers');
  });

  test('contains get query', () => {
    expect(GET_ZELLER_CUSTOMER).toContain('getZellerCustomer');
  });
});
