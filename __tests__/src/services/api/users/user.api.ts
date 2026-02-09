import { LIST_ZELLER_CUSTOMERS } from '../../graphql/queries';
import { ZellerCustomer } from '../../graphql/types';
import { graphqlClient } from '../graphqlClient';

type Response = {
  listZellerCustomers: {
    items: ZellerCustomer[];
  };
};

export const fetchUsers = async () => {
  const data = await graphqlClient.request<Response>(LIST_ZELLER_CUSTOMERS);
  return data.listZellerCustomers.items ?? [];
};
