import React from 'react';
import ReactTestRenderer from 'react-test-renderer';
import AddUserScreen from '../../../../src/screens/add-user/add-user.screen';

jest.mock('../../../../src/components/add-user.component', () => (props: any) => null);

describe('screens/AddUserScreen', () => {
  test('renders without crashing', () => {
    let renderer: ReactTestRenderer.ReactTestRenderer;
    ReactTestRenderer.act(() => {
      renderer = ReactTestRenderer.create(<AddUserScreen />);
    });
    expect(renderer!.toJSON()).toBeNull();
  });
});
