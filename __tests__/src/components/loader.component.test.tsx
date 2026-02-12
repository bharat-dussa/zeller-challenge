import React from 'react';
import { render, screen } from '@testing-library/react-native';
import { Loader } from '../../../src/shared/components/loader.component';

describe('components/Loader', () => {
  test('renders loading text', () => {
    render(<Loader />);
    expect(screen.getByTestId('loader-container')).toBeTruthy();
    expect(screen.getByTestId('loader-text').props.children).toBe('Loading...');
  });
});
