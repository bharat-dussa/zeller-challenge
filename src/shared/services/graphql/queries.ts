export const LIST_ZELLER_CUSTOMERS = `
  query {
  listZellerCustomers {
    items {
      id
      name
      email
      role
    }
    nextToken
  }
}

`;

export const GET_ZELLER_CUSTOMER = `
  query GetZellerCustomer($id: String!) {
    getZellerCustomer(id: $id) {
      id
      name
      email
      role
    }
  }
`;