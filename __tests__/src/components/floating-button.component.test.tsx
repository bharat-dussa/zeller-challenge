import React from 'react';
import { fireEvent, render, screen } from '@testing-library/react-native';
import { FloatingButton } from '../../../src/shared/components/floating-button.component';

describe('components/FloatingButton', () => {
  test('renders and handles press', () => {
    const onPress = jest.fn();
    render(<FloatingButton onPress={onPress} />);
    fireEvent.press(screen.getByTestId('floating-button'));

    expect(onPress).toHaveBeenCalled();
    expect(screen.getByTestId('floating-button-icon').props.children).toBe('+');
  });
});
