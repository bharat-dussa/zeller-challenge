import React from 'react';
import ReactTestRenderer from 'react-test-renderer';
import { RootNavigator } from '../../../../src/navigation/root-navigator/root-navigator';

describe('navigation/RootNavigator', () => {
  test('renders without crashing', () => {
    let renderer: ReactTestRenderer.ReactTestRenderer;
    ReactTestRenderer.act(() => {
      renderer = ReactTestRenderer.create(<RootNavigator />);
    });
    expect(renderer!.toJSON()).toBeNull();
  });
});
