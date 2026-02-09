import React from 'react';
import ReactTestRenderer from 'react-test-renderer';
import { TabBar } from '../../../src/components/tab-bar.component';

jest.mock('../../../src/components/icons/search.icon', () => (props: any) => null);

describe('components/TabBar', () => {
  test('throws when animatedIndex missing', () => {
    expect(() => {
      ReactTestRenderer.act(() => {
        ReactTestRenderer.create(
          <TabBar
            // @ts-expect-error
            animatedIndex={null}
            tabs={['All']}
            onPress={jest.fn()}
          />,
        );
      });
    }).toThrow('Index is required');
  });

  test('renders tabs and handles press/onLayout', () => {
    const animatedIndex = { value: 0 } as any;
    const onPress = jest.fn();

    let renderer: ReactTestRenderer.ReactTestRenderer;
    ReactTestRenderer.act(() => {
      renderer = ReactTestRenderer.create(
        <TabBar animatedIndex={animatedIndex} tabs={['All', 'Admin']} onPress={onPress} />,
      );
    });

    const touchables = renderer!.root.findAllByType('TouchableOpacity');
    const tabTouchables = touchables.filter(node => node.props.onLayout);

    ReactTestRenderer.act(() => {
      tabTouchables[0].props.onLayout({ nativeEvent: { layout: { width: 100 } } });
      tabTouchables[1].props.onLayout({ nativeEvent: { layout: { width: 100 } } });
    });

    ReactTestRenderer.act(() => {
      tabTouchables[1].props.onPress();
    });

    expect(animatedIndex.value).toBe(1);
    expect(onPress).toHaveBeenCalled();
  });

  test('toggles search and calls onSearch', () => {
    const animatedIndex = { value: 0 } as any;
    const onSearch = jest.fn();

    let renderer: ReactTestRenderer.ReactTestRenderer;
    ReactTestRenderer.act(() => {
      renderer = ReactTestRenderer.create(
        <TabBar
          animatedIndex={animatedIndex}
          tabs={['All']}
          onPress={jest.fn()}
          search
          searchQuery=""
          onSearch={onSearch}
        />,
      );
    });

    const touchables = renderer!.root.findAllByType('TouchableOpacity');
    const searchToggle = touchables[touchables.length - 1];

    ReactTestRenderer.act(() => {
      searchToggle.props.onPress();
    });

    expect(onSearch).toHaveBeenCalledWith('');

    const input = renderer!.root.findByType('TextInput');
    ReactTestRenderer.act(() => {
      input.props.onChangeText('abc');
    });
    expect(onSearch).toHaveBeenCalledWith('abc');

    const cancelText = renderer!.root.findAllByType('Text').find(n => n.props.children === 'Cancel');
    expect(cancelText).toBeTruthy();
  });
});
