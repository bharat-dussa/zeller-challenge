import { fireEvent, render } from '@testing-library/react-native';
import React from 'react';
import { AppButton } from '../../../src/shared/components/app-button.component';
import { Text } from 'react-native';

jest.mock('../../../src/shared/components/loader.component', () => {
  const { Text } = require('react-native');

  return {
    Loader: () => <Text testID="loader">Loading...</Text>,
  };
});

describe('components/AppButton', () => {
  const defaultProps = {
    title: 'Submit',
    onPress: jest.fn(),
  };
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('renders title correctly', () => {
    const { getByText } = render(<AppButton {...defaultProps} />);
    expect(getByText('Submit')).toBeTruthy();
  });

  test('calls onPress when pressed', () => {
    const { getByTestId } = render(<AppButton {...defaultProps} />);

    fireEvent.press(getByTestId('app-button'));
    expect(defaultProps.onPress).toHaveBeenCalledTimes(1);
  });

  test('supports custom testID', () => {
    const { getByTestId } = render(<AppButton {...defaultProps} testID="submit-button" />);
    expect(getByTestId('submit-button')).toBeTruthy();
    expect(getByTestId('submit-button-label').props.children).toBe('Submit');
  });

  test('does not call onPress when disabled', () => {
    const { getByTestId } = render(
      <AppButton {...defaultProps} disabled />
    );

    fireEvent.press(getByTestId('app-button'));

    expect(defaultProps.onPress).not.toHaveBeenCalled();
  });

  test('shows loader when loading=true', () => {
    const { getByTestId, queryByText } = render(
      <AppButton {...defaultProps} loading />
    );

    expect(getByTestId('loader')).toBeTruthy();
    expect(queryByText('Submit')).toBeNull();
  });

  test('renders left and right icons', () => {
    const { getByTestId } = render(
      <AppButton
        {...defaultProps}
        leftIcon={<Text testID="left-icon">L</Text>}
        rightIcon={<Text testID="right-icon">R</Text>}
      />
    );

    expect(getByTestId('left-icon')).toBeTruthy();
    expect(getByTestId('right-icon')).toBeTruthy();
  });


  test('applies secondary variant styles', () => {
    const { getByTestId } = render(
      <AppButton {...defaultProps} variant="secondary" />
    );

    const button = getByTestId('app-button');

    expect(button.props.style).toBeTruthy();
  });

  test('becomes disabled when loading=true', () => {
    const { getByTestId } = render(
      <AppButton {...defaultProps} loading />
    );

    fireEvent.press(getByTestId('app-button'));
    expect(defaultProps.onPress).not.toHaveBeenCalled();
  });

  test('renders label variant', () => {
    const { getByText } = render(
      <AppButton {...defaultProps} variant="label" />
    );

    expect(getByText('Submit')).toBeTruthy();
  });
});
