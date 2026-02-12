import React from 'react';
import { render, waitFor } from '@testing-library/react-native';

let mockRealmValue: any = {};

jest.mock('@realm/react', () => ({
  Realm: { Object: class {} },
  createRealmContext: () => ({
    RealmProvider: ({ children }: any) => children,
    useRealm: () => mockRealmValue,
    useQuery: () => [],
    useObject: () => null,
  }),
}));

import {
  RealmServiceProvider,
  useRealmService,
} from '../../../src/app/providers/realm-service.context';

describe('context/realm-service.context', () => {
  beforeEach(() => {
    mockRealmValue = {};
  });

  test('useRealmService throws when used outside provider', () => {
    const Thrower = () => {
      useRealmService();
      return null;
    };

    expect(() => {
      render(<Thrower />);
    }).toThrow('useRealmService must be used within RealmServiceProvider');
  });

  test('provider returns null when realm is missing', async () => {
    mockRealmValue = null;

    const tree = render(
      <RealmServiceProvider>
        <React.Fragment />
      </RealmServiceProvider>,
    );

    await waitFor(() => {
      expect(tree.toJSON()).toBeNull();
    });

  });

  test('provider sets service and exposes it to consumers', async () => {
    const realm = { id: 'realm' };
    mockRealmValue = realm;

    let captured: any = null;
    const Consumer = () => {
      captured = useRealmService();
      return <React.Fragment />;
    };

    render(
      <RealmServiceProvider>
        <Consumer />
      </RealmServiceProvider>,
    );

    await waitFor(() => {
      expect(captured?.realm).toBe(realm);
    });
  });
});
