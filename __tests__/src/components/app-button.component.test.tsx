import React from 'react';
import ReactTestRenderer from 'react-test-renderer';
import AppButton from '../../../src/components/app-button.component';

describe('components/AppButton', () => {
  test('renders and handles press', () => {
    const onPress = jest.fn();
    let renderer: ReactTestRenderer.ReactTestRenderer;
    ReactTestRenderer.act(() => {
      renderer = ReactTestRenderer.create(<AppButton onPress={onPress} />);
    });
    const button = renderer!.root.findByType('TouchableOpacity');
    button.props.onPress();
    expect(onPress).toHaveBeenCalled();
  });
});
