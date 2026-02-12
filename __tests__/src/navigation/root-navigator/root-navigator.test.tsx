import React from 'react';
import { render } from '@testing-library/react-native';
import { RootNavigator } from '../../../../src/app/navigation/root-navigator';
import { ROUTES } from '../../../../src/shared/utils/route';

describe('navigation/RootNavigator', () => {
  test('registers expected routes', () => {
    const { UNSAFE_getByType, UNSAFE_getAllByType } = render(<RootNavigator />);

    const navigator = UNSAFE_getByType('StackNavigator');
    const screens = UNSAFE_getAllByType('StackScreen');

    expect(navigator.props.screenOptions).toEqual({ headerShown: false });
    expect(screens).toHaveLength(2);
    expect(screens[0].props.name).toBe(ROUTES.userListScreen);
    expect(screens[1].props.name).toBe(ROUTES.addUserScreen);
  });
});
