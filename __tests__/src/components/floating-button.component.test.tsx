import React from 'react';
import ReactTestRenderer from 'react-test-renderer';
import { FloatingButton } from '../../../src/components/floating-button.component';

describe('components/FloatingButton', () => {
  test('renders and handles press', () => {
    const onPress = jest.fn();
    let renderer: ReactTestRenderer.ReactTestRenderer;
    ReactTestRenderer.act(() => {
      renderer = ReactTestRenderer.create(<FloatingButton onPress={onPress} />);
    });
    const button = renderer!.root.findByType('TouchableOpacity');
    button.props.onPress();
    expect(onPress).toHaveBeenCalled();
  });
});
