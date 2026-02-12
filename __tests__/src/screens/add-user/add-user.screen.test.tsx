import React from 'react';
import { render } from '@testing-library/react-native';
import AddUserScreen from '../../../../src/features/users/screens/add-user.screen';

const mockUseRoute = jest.fn();
const mockAddUserProps = jest.fn();

jest.mock('@react-navigation/native', () => ({
  useRoute: () => mockUseRoute(),
}));

jest.mock('../../../../src/features/users/components/add-user.component', () => {
  const React = require('react');
  const { Text } = require('react-native');

  return (props: any) => {
    mockAddUserProps(props);
    return <Text testID="add-user-component-mock">add-user</Text>;
  };
});

describe('screens/AddUserScreen', () => {
  beforeEach(() => {
    mockUseRoute.mockReset();
    mockAddUserProps.mockReset();
  });

  test('passes create mode props when route has no user', () => {
    mockUseRoute.mockReturnValue({ params: {} });

    render(<AddUserScreen />);

    expect(mockAddUserProps).toHaveBeenCalledWith({
      isEditMode: false,
      user: undefined,
    });
  });

  test('passes edit mode props when route contains user', () => {
    const user = {
      id: '1',
      name: 'Alice',
      role: 'Admin',
      email: 'alice@example.com',
    };
    mockUseRoute.mockReturnValue({ params: { user } });

    render(<AddUserScreen />);

    expect(mockAddUserProps).toHaveBeenCalledWith({
      isEditMode: true,
      user,
    });
  });
});
