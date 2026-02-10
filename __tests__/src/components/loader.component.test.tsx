import React from 'react';
import ReactTestRenderer from 'react-test-renderer';
import { Loader } from '../../../src/shared/components/loader.component';

describe('components/Loader', () => {
  test('renders loading text', () => {
    let renderer: ReactTestRenderer.ReactTestRenderer;
    ReactTestRenderer.act(() => {
      renderer = ReactTestRenderer.create(<Loader />);
    });
    const text = renderer!.root.findByType('Text');
    expect(text.props.children).toBe('Loading...');
  });
});
