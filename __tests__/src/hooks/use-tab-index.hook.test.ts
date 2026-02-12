import React from 'react';
import ReactTestRenderer from 'react-test-renderer';
import { useTabIndex } from '../../../src/shared/hooks/use-tab-index.hook';

describe('hooks/use-tab-index', () => {
  test('returns default value and setter', () => {
    let current: any;

    const HookTester = () => {
      const { index, setIndex } = useTabIndex(0);
      current = { index, setIndex };
      return null;
    };

    ReactTestRenderer.act(() => {
      ReactTestRenderer.create(React.createElement(HookTester));
    });

    expect(current.index.value).toBe(0);
    current.setIndex(4);
    expect(current.index.value).toBe(4);
  });

  test('returns shared value and setter', () => {
    let current: any;

    const HookTester = () => {
      const { index, setIndex } = useTabIndex(2);
      current = { index, setIndex };
      return null;
    };

    ReactTestRenderer.act(() => {
      ReactTestRenderer.create(React.createElement(HookTester));
    });

    expect(current.index.value).toBe(2);
    current.setIndex(4);
    expect(current.index.value).toBe(4);
  });
});
