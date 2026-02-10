type Loaded = {
  React: typeof import('react');
  ReactTestRenderer: typeof import('react-test-renderer');
  Context: typeof import('../../../src/app/providers/realm-service.context');
  mockFromRealm: jest.Mock;
};

const loadModule = (realmValue: any): Loaded => {
  jest.resetModules();

  const mockFromRealm = jest.fn(() => ({ id: 'service' }));

  jest.doMock('@realm/react', () => ({
    Realm: { Object: class {} },
    createRealmContext: () => ({
      RealmProvider: ({ children }: any) => children,
      useRealm: () => realmValue,
      useQuery: () => [],
      useObject: () => null,
    }),
  }));

  jest.doMock('../../../src/shared/services/realm/realm-service', () => ({
    RealmService: { fromRealm: mockFromRealm },
  }));

  const React = require('react');
  const ReactTestRenderer = require('react-test-renderer');
  const Context = require('../../../src/app/providers/realm-service.context');

  return { React, ReactTestRenderer, Context, mockFromRealm };
};

describe('context/realm-service.context', () => {
  test('useRealmService throws when used outside provider', () => {
    const { React, ReactTestRenderer, Context } = loadModule({});

    const Thrower = () => {
      Context.useRealmService();
      return null;
    };

    expect(() => {
      ReactTestRenderer.act(() => {
        ReactTestRenderer.create(React.createElement(Thrower));
      });
    }).toThrow('useRealmService must be used within RealmServiceProvider');
  });

  test('provider returns null when realm is missing', async () => {
    const { React, ReactTestRenderer, Context, mockFromRealm } = loadModule(null);

    let renderer: any;
    await ReactTestRenderer.act(async () => {
      renderer = ReactTestRenderer.create(
        React.createElement(
          Context.RealmServiceProvider,
          null,
          React.createElement(React.Fragment, null),
        ),
      );
      await Promise.resolve();
    });

    expect(renderer!.toJSON()).toBeNull();
    expect(mockFromRealm).not.toHaveBeenCalled();
  });

  test('provider sets service and exposes it to consumers', async () => {
    const realmValue = { id: 'realm' };
    const { React, ReactTestRenderer, Context, mockFromRealm } =
      loadModule(realmValue);

    let captured: any = null;
    const Consumer = () => {
      captured = Context.useRealmService();
      return null;
    };

    await ReactTestRenderer.act(async () => {
      ReactTestRenderer.create(
        React.createElement(
          Context.RealmServiceProvider,
          null,
          React.createElement(Consumer, null),
        ),
      );
      await Promise.resolve();
    });

    expect(mockFromRealm).toHaveBeenCalledWith(realmValue);
    expect(captured).toEqual({ id: 'service' });
  });
});
