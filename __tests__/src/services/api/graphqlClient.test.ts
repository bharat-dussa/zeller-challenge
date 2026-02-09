import { graphqlClient } from '../../../../src/services/api/graphqlClient';
import { GraphQLClient } from 'graphql-request';

jest.mock('graphql-request', () => ({
  GraphQLClient: jest.fn(() => ({ request: jest.fn() })),
}));

describe('services/api/graphqlClient', () => {
  test('creates a GraphQL client with headers', () => {
    expect(GraphQLClient).toHaveBeenCalledTimes(1);
    expect(GraphQLClient).toHaveBeenCalledWith('http://localhost:9002/graphql', {
      headers: {
        'Content-Type': 'application/json',
      },
    });
    expect(graphqlClient).toBeDefined();
  });
});
