import React from 'react';
import ReactTestRenderer from 'react-test-renderer';
import CloseIcon from '../../../../src/shared/components/icons/close.icon';

describe('components/icons/CloseIcon', () => {
  test('renders svg', () => {
    let renderer: ReactTestRenderer.ReactTestRenderer;
    ReactTestRenderer.act(() => {
      renderer = ReactTestRenderer.create(<CloseIcon width={16} height={16} />);
    });
    expect(renderer!.toJSON()).toBeNull();
  });
});
