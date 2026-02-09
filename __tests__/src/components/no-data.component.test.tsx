import React from 'react';
import ReactTestRenderer from 'react-test-renderer';
import { NoData } from '../../../src/components/no-data.component';

describe('components/NoData', () => {
  test('renders no data text', () => {
    let renderer: ReactTestRenderer.ReactTestRenderer;
    ReactTestRenderer.act(() => {
      renderer = ReactTestRenderer.create(<NoData />);
    });
    const text = renderer!.root.findByType('Text');
    expect(text.props.children).toBe('No Data');
  });
});
