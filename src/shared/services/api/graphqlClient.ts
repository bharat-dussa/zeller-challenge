import { GraphQLClient } from 'graphql-request';

/**
 * your provided config for graphql are returning 401 (Unauthorized) so using mocked server.
 * either key is changed or expired.
 * 
 * returning this.
 * [
  {
    "errorType": "UnauthorizedException",
    "message": "Valid authorization header not provided."
  }
]
 */
export const graphqlClient = new GraphQLClient(
  'http://localhost:9002/graphql',
  {
    headers: {
      'Content-Type': 'application/json',
      // 'API-KEY': ''
    },
  }
);
