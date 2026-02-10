import { ZellerCustomer } from '../../../../../shared/services/graphql/types';
import { graphqlClient } from '../../../../../shared/services/api/graphqlClient';
import { LIST_ZELLER_CUSTOMERS } from '../../../../../shared/services/graphql/queries';

type Response = {
  listZellerCustomers: {
    items: ZellerCustomer[];
  };
};

export const fetchUsers = async () => {
  const data = await graphqlClient.request<Response>(LIST_ZELLER_CUSTOMERS);
  return data.listZellerCustomers.items ?? [];
};
