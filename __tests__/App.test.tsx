/**
 * @format
 */

import React from 'react';
import { render, screen, waitFor } from '@testing-library/react-native';
import App from '../App';
import { createEncryptedRealmConfig } from '../src/shared/db/realConfig';

jest.mock('../src/shared/db/realConfig', () => ({
  createEncryptedRealmConfig: jest.fn(),
}));

jest.mock('../src/app/navigation/root-navigator', () => ({
  RootNavigator: () => {
    const { Text } = require('react-native');
    return <Text testID="root-navigator">Root Navigator</Text>;
  },
}));

describe('App', () => {
  beforeAll(() => {
    const { StyleSheet } = require('react-native');
    if (!StyleSheet.flatten) {
      StyleSheet.flatten = (style: any) => style;
    }
  });

  test('renders root navigator after config resolves', async () => {
    (createEncryptedRealmConfig as jest.Mock).mockResolvedValue({});

    render(<App />);

    await waitFor(() => {
      expect(screen.getByTestId('root-navigator')).toBeTruthy();
    });
  });
});
