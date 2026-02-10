import { GraphQLClient } from 'graphql-request';

export const graphqlClient = new GraphQLClient(
  'http://localhost:9002/graphql',
  {
    headers: {
      'Content-Type': 'application/json',
    },
  }
);
