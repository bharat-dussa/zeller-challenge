/**
 * @format
 */

import React from 'react';
import { render, screen } from '@testing-library/react-native';

jest.mock('../src/shared/db/realConfig', () => ({
  createEncryptedRealmConfig: jest.fn(),
}));

jest.mock('../src/app/navigation/root-navigator', () => ({
  RootNavigator: () => {
    const { Text } = require('react-native');
    return <Text testID="root-navigator">Root Navigator</Text>;
  },
}));


jest.mock('../src/app/providers/realm-service.context', () => {
  const React = require('react');

  return {
    RealmProvider: ({ children }: { children: React.ReactNode }) =>
      React.createElement(React.Fragment, null, children),
    RealmServiceProvider: ({ children }: { children: React.ReactNode }) =>
      React.createElement(React.Fragment, null, children),
  };
});

jest.mock('../src/shared/services/realm/realm-service', () => ({
  RealmService: {
    fromRealm: jest.fn(() => ({})),
  },
}));

const { createEncryptedRealmConfig } = require('../src/shared/db/realConfig');
const App = require('../App').default;

describe('App', () => {
  test('requests realm config and renders null until config resolves', () => {
    (createEncryptedRealmConfig as jest.Mock).mockReturnValue(new Promise(() => {}));

    const view = render(<App />);

    expect(createEncryptedRealmConfig).toHaveBeenCalledTimes(1);
    expect(screen.queryByTestId('root-navigator')).toBeNull();
    expect(view.toJSON()).toBeNull();
  });
});
