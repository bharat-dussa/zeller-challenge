import React from 'react';
import { render, screen } from '@testing-library/react-native';
import { NoData } from '../../../src/shared/components/no-data.component';

describe('components/NoData', () => {
  test('renders no data text', () => {
    render(<NoData />);
    expect(screen.getByTestId('no-data-container')).toBeTruthy();
    expect(screen.getByTestId('no-data-text').props.children).toBe('No Data');
  });
});
