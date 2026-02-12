import React from 'react';
import { act, render } from '@testing-library/react-native';
import UserListScreen from '../../../../src/features/users/screens/user-list.screen';
import { ROUTES } from '../../../../src/shared/utils/route';
import { TABS } from '../../../../src/shared/utils/common';

const mockSetIndex = jest.fn();
const mockSetPage = jest.fn();
const mockNavigate = jest.fn();

const mockIndex = { value: 0 };

let mockTabBarProps: any = null;
let mockFloatingButtonProps: any = null;
let mockPagerProps: any = null;
const mockUserListProps: any[] = [];

jest.mock('../../../../src/shared/hooks/use-tab-index.hook', () => ({
  useTabIndex: () => ({ index: mockIndex, setIndex: mockSetIndex }),
}));

jest.mock('../../../../src/shared/hooks/use-app-navigation.hook', () => ({
  useAppNavigation: () => ({ navigate: mockNavigate }),
}));

jest.mock('../../../../src/shared/components/tab-bar.component', () => {
  const React = require('react');

  return {
    TabBar: (props: any) => {
      mockTabBarProps = props;
      return React.createElement('TabBar', { testID: 'tab-bar-mock', ...props });
    },
  };
});

jest.mock('../../../../src/shared/components/floating-button.component', () => {
  const React = require('react');

  return {
    FloatingButton: (props: any) => {
      mockFloatingButtonProps = props;
      return React.createElement('FloatingButton', { testID: 'floating-button-mock', ...props });
    },
  };
});

jest.mock('../../../../src/features/users/components/user-list.component', () => {
  const React = require('react');

  return {
    UserList: (props: any) => {
      mockUserListProps.push(props);
      return React.createElement('UserList', { testID: `user-list-mock-${props.role}`, ...props });
    },
  };
});

jest.mock('react-native-pager-view', () => {
  const React = require('react');

  return React.forwardRef((props: any, ref: any) => {
    mockPagerProps = props;
    if (ref) {
      ref.current = { setPage: mockSetPage };
    }

    return React.createElement('PagerView', props, props.children);
  });
});

describe('screens/UserListScreen', () => {
  beforeEach(() => {
    mockIndex.value = 0;
    mockSetIndex.mockClear();
    mockSetPage.mockClear();
    mockNavigate.mockClear();
    mockTabBarProps = null;
    mockFloatingButtonProps = null;
    mockPagerProps = null;
    mockUserListProps.length = 0;
  });

  test('passes required props to tab bar and list pages', () => {
    render(<UserListScreen />);

    expect(mockTabBarProps.tabs).toEqual(TABS);
    expect(mockTabBarProps.search).toBe(true);
    expect(mockTabBarProps.searchQuery).toBe('');

    expect(mockUserListProps).toHaveLength(TABS.length);
    expect(mockUserListProps.map(p => p.role)).toEqual(TABS);
  });

  test('handles tab press and page selection', () => {
    render(<UserListScreen />);

    act(() => {
      mockTabBarProps.onPress(2);
    });
    expect(mockSetIndex).toHaveBeenCalledWith(2);
    expect(mockSetPage).toHaveBeenCalledWith(2);

    act(() => {
      mockPagerProps.onPageSelected({ nativeEvent: { position: 1 } });
    });
    expect(mockSetIndex).toHaveBeenCalledWith(1);
    expect(mockSetPage).toHaveBeenCalledWith(1);
  });

  test('updates search query for all pager pages', () => {
    render(<UserListScreen />);

    act(() => {
      mockTabBarProps.onSearch('ali');
    });

    const latestProps = mockUserListProps.slice(-TABS.length);
    latestProps.forEach((props: any) => {
      expect(props.searchQuery).toBe('ali');
    });
  });

  test('navigates to add user on floating button press', () => {
    render(<UserListScreen />);

    act(() => {
      mockFloatingButtonProps.onPress();
    });

    expect(mockNavigate).toHaveBeenCalledWith(ROUTES.addUserScreen);
  });
});
