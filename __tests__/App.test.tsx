/**
 * @format
 */

import React from 'react';
import ReactTestRenderer from 'react-test-renderer';
import App from '../App';
import { createEncryptedRealmConfig } from '../src/db/realConfig';
import { RootNavigator } from '../src/navigation/root-navigator/root-navigator';

jest.mock('../src/db/realConfig', () => ({
  createEncryptedRealmConfig: jest.fn(),
}));

describe('App', () => {
  test('renders root navigator after config resolves', async () => {
    (createEncryptedRealmConfig as jest.Mock).mockResolvedValue({});

    let renderer: ReactTestRenderer.ReactTestRenderer;

    await ReactTestRenderer.act(async () => {
      renderer = ReactTestRenderer.create(<App />);
      await Promise.resolve();
    });

    const root = renderer!.root;
    expect(root.findAllByType(RootNavigator)).toHaveLength(1);
  });
});
