import React from 'react';
import { fireEvent, render, screen } from '@testing-library/react-native';
import { TabBar, TabBarRef } from '../../../src/shared/components/tab-bar.component';

const mockIndex = { value: 0 };
const mockSetIndex = jest.fn();

jest.mock('../../../src/shared/hooks/use-tab-index.hook', () => ({
  useTabIndex: () => ({ index: mockIndex, setIndex: mockSetIndex }),
}));

describe('components/TabBar', () => {
  beforeEach(() => {
    mockIndex.value = 0;
    mockSetIndex.mockClear();
  });

  test("renders empty tabs", () => {
    const onPress = jest.fn();
    render(<TabBar tabs={[]} onPress={onPress} />);

    const firstTab = screen.queryByTestId('tab-item-0');

    expect(firstTab).not.toBeOnTheScreen();
  });

  test('uses default tabs and exposes imperative setIndex via ref', () => {
    const ref = React.createRef<TabBarRef>();
    const onPress = jest.fn();

    render(<TabBar ref={ref} {...({ onPress } as any)} />);

    expect(screen.queryByTestId('tab-item-0')).not.toBeOnTheScreen();

    ref.current?.setIndex(2);
    expect(mockSetIndex).toHaveBeenCalledWith(2);
  });

  test('renders tabs and handles tab press/onLayout', () => {
    const onPress = jest.fn();

    render(<TabBar tabs={['All', 'Admin']} onPress={onPress} />);

    const firstTab = screen.getByTestId('tab-item-0');
    const secondTab = screen.getByTestId('tab-item-1');

    fireEvent(firstTab, 'layout', { nativeEvent: { layout: { width: 100 } } });
    fireEvent(secondTab, 'layout', { nativeEvent: { layout: { width: 100 } } });
    fireEvent.press(secondTab);

    expect(mockSetIndex).toHaveBeenCalledWith(1);
    expect(onPress).toHaveBeenCalledWith(1);
  });

  test('toggles search, clears query, and forwards input changes', () => {
    const onSearch = jest.fn();

    render(
      <TabBar
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

    fireEvent.press(screen.getByTestId('tab-bar-search-toggle'));
    expect(onSearch).toHaveBeenLastCalledWith('');
    expect(screen.queryByTestId('tab-bar-search-input')).not.toBeOnTheScreen();
  });
});
