import React from 'react';
import ReactTestRenderer from 'react-test-renderer';
import UserListScreen from '../../../../src/screens/user-list/user-list.screen';
import { ROUTES } from '../../../../src/utils/route';

let mockUsers: any[] = [];
let mockLoading = false;
const mockSetIndex = jest.fn();
const mockNavigate = jest.fn();
const mockSetPage = jest.fn();

let mockTabBarProps: any = null;
let mockFloatingButtonProps: any = null;
let mockPagerProps: any = null;

jest.mock('../../../../src/hooks/use-users.hook', () => ({
  useUsers: () => ({ loading: mockLoading, users: mockUsers }),
}));

jest.mock('../../../../src/hooks/use-tab-index.hook', () => ({
  useTabIndex: () => [{ value: 0 }, mockSetIndex],
}));

jest.mock('@react-navigation/native', () => ({
  useNavigation: () => ({ navigate: mockNavigate }),
}));

jest.mock('../../../../src/components/tab-bar.component', () => {
  const React = require('react');
  return {
    TabBar: (props: any) => {
      mockTabBarProps = props;
      return React.createElement('TabBar', props, props.children);
    },
  };
});

jest.mock('../../../../src/components/floating-button.component', () => {
  const React = require('react');
  return {
    FloatingButton: (props: any) => {
      mockFloatingButtonProps = props;
      return React.createElement('FloatingButton', props, props.children);
    },
  };
});

jest.mock('../../../../src/components/loader.component', () => {
  const React = require('react');
  return {
    Loader: (props: any) => React.createElement('Loader', props),
  };
});

jest.mock('../../../../src/components/no-data.component', () => {
  const React = require('react');
  return {
    NoData: (props: any) => React.createElement('NoData', props),
  };
});

jest.mock('../../../../src/components/user-list.component', () => {
  const React = require('react');
  return {
    UserList: (props: any) => React.createElement('UserList', props, props.children),
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
    mockUsers = [];
    mockLoading = false;
    mockSetIndex.mockClear();
    mockNavigate.mockClear();
    mockSetPage.mockClear();
    mockTabBarProps = null;
    mockFloatingButtonProps = null;
    mockPagerProps = null;
  });

  test('shows loader when loading', () => {
    mockLoading = true;
    let renderer: ReactTestRenderer.ReactTestRenderer;
    ReactTestRenderer.act(() => {
      renderer = ReactTestRenderer.create(<UserListScreen />);
    });
    expect(renderer!.root.findAllByType('Loader')).toHaveLength(1);
  });

  test('shows no data when search has input and list empty', () => {
    mockUsers = [];
    let renderer: ReactTestRenderer.ReactTestRenderer;
    ReactTestRenderer.act(() => {
      renderer = ReactTestRenderer.create(<UserListScreen />);
    });

    ReactTestRenderer.act(() => {
      mockTabBarProps.onSearch('ab');
    });

    expect(renderer!.root.findAllByType('NoData')).toHaveLength(1);
    expect(renderer!.root.findAllByType('PagerView')).toHaveLength(0);
  });

  test('renders pager and handles navigation', () => {
    mockUsers = [{ id: '1', _id: '1', name: 'Alice', role: 'Admin', email: 'a@a.com' }];

    let renderer: ReactTestRenderer.ReactTestRenderer;
    ReactTestRenderer.act(() => {
      renderer = ReactTestRenderer.create(<UserListScreen />);
    });

    expect(renderer!.root.findAllByType('PagerView')).toHaveLength(1);

    ReactTestRenderer.act(() => {
      mockPagerProps.onPageSelected({ nativeEvent: { position: 1 } });
    });
    expect(mockSetIndex).toHaveBeenCalledWith(1);
    expect(mockSetPage).toHaveBeenCalledWith(1);

    ReactTestRenderer.act(() => {
      mockTabBarProps.onPress(2);
    });
    expect(mockSetIndex).toHaveBeenCalledWith(2);
    expect(mockSetPage).toHaveBeenCalledWith(2);

    ReactTestRenderer.act(() => {
      mockFloatingButtonProps.onPress();
    });
    expect(mockNavigate).toHaveBeenCalledWith(ROUTES.addUserScreen);
  });
});
