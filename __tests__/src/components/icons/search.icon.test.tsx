import React from 'react';
import ReactTestRenderer from 'react-test-renderer';
import SearchIcon from '../../../../src/shared/components/icons/search.icon';

describe('components/icons/SearchIcon', () => {
  test('renders svg', () => {
    let renderer: ReactTestRenderer.ReactTestRenderer;
    ReactTestRenderer.act(() => {
      renderer = ReactTestRenderer.create(<SearchIcon width={16} height={16} />);
    });
    expect(renderer!.toJSON()).toBeNull();
  });
});
