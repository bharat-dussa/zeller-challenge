import React from 'react';
import ReactTestRenderer from 'react-test-renderer';
import AddUserScreen from '../../../../src/features/users/screens/add-user.screen';

jest.mock('../../../../src/features/users/components/add-user.component', () => (props: any) => null);

describe('screens/AddUserScreen', () => {
  test('renders without crashing', () => {
    let renderer: ReactTestRenderer.ReactTestRenderer;
    ReactTestRenderer.act(() => {
      renderer = ReactTestRenderer.create(<AddUserScreen />);
    });
    expect(renderer!.toJSON()).toBeNull();
  });
});
