import React from 'react';
import { fireEvent, render, screen } from '@testing-library/react-native';
import { TabBar } from '../../../src/shared/components/tab-bar.component';

describe('components/TabBar', () => {
  test('throws when animatedIndex is missing', () => {
    expect(() => {
      render(
        <TabBar
          // @ts-expect-error
          animatedIndex={null}
          tabs={['All']}
          onPress={jest.fn()}
        />,
      );
    }).toThrow('Index is required');
  });

  test('renders tabs and handles tab press/onLayout', () => {
    const animatedIndex = { value: 0 } as any;
    const onPress = jest.fn();

    render(<TabBar animatedIndex={animatedIndex} tabs={['All', 'Admin']} onPress={onPress} />);

    const firstTab = screen.getByTestId('tab-item-0');
    const secondTab = screen.getByTestId('tab-item-1');

    fireEvent(firstTab, 'layout', { nativeEvent: { layout: { width: 100 } } });
    fireEvent(secondTab, 'layout', { nativeEvent: { layout: { width: 100 } } });
    fireEvent.press(secondTab);

    expect(animatedIndex.value).toBe(1);
    expect(onPress).toHaveBeenCalledWith(1);
  });

  test('toggles search, clears query, and forwards input changes', () => {
    const animatedIndex = { value: 0 } as any;
    const onSearch = jest.fn();

    render(
      <TabBar
        animatedIndex={animatedIndex}
        tabs={['All']}
        onPress={jest.fn()}
        search
        searchQuery=""
        onSearch={onSearch}
      />,
    );

    fireEvent.press(screen.getByTestId('tab-bar-search-toggle'));
    expect(onSearch).toHaveBeenCalledWith('');

    const input = screen.getByTestId('tab-bar-search-input');
    fireEvent.changeText(input, 'abc');
    expect(onSearch).toHaveBeenCalledWith('abc');

    expect(screen.getByTestId('tab-bar-search-cancel')).toBeTruthy();
  });
});
