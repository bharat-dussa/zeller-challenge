import React from 'react';
import ReactTestRenderer from 'react-test-renderer';
import { UserList } from '../../../src/components/user-list.component';
import { ROUTES } from '../../../src/utils/route';

const mockNavigate = jest.fn();
const mockOnRefresh = jest.fn();

jest.mock('@react-navigation/native', () => ({
  useNavigation: () => ({ navigate: mockNavigate }),
}));

jest.mock('../../../src/hooks/use-users.hook', () => ({
  useUsers: () => ({ onRefresh: mockOnRefresh, refreshing: false }),
}));

describe('components/UserList', () => {
  beforeEach(() => {
    mockNavigate.mockClear();
    mockOnRefresh.mockClear();
  });

  test('renders section list and triggers navigation', () => {
    const data = [
      { id: '1', _id: '1', name: 'Alice', role: 'Admin', email: 'a@a.com', letter: 'A' },
      { id: '2', _id: '2', name: 'Bob', role: 'Manager', email: 'b@b.com', letter: 'B' },
    ];

    let renderer: ReactTestRenderer.ReactTestRenderer;
    ReactTestRenderer.act(() => {
      renderer = ReactTestRenderer.create(<UserList data={data as any} />);
    });

    const sectionList = renderer!.root.findByType('SectionList');
    expect(sectionList.props.refreshControl.props.refreshing).toBe(false);

    let headerTree: ReactTestRenderer.ReactTestRenderer;
    ReactTestRenderer.act(() => {
      headerTree = ReactTestRenderer.create(
        sectionList.props.renderSectionHeader({ section: { title: 'A' } }),
      );
    });
    expect(headerTree!.root.findByType('Text').props.children).toBe('A');

    let adminTree: ReactTestRenderer.ReactTestRenderer;
    ReactTestRenderer.act(() => {
      adminTree = ReactTestRenderer.create(
        sectionList.props.renderItem({
          item: { id: '1', name: 'Alice', role: 'Admin', email: 'a@a.com' },
          index: 0,
          section: { title: 'A', data: [] },
        }),
      );
    });

    const adminRoleText = adminTree!.root.findAllByType('Text').map(n => n.props.children);
    expect(adminRoleText).toContain('Admin');

    const touchable = adminTree!.root.findByType('TouchableOpacity');
    touchable.props.onPress();
    expect(mockNavigate).toHaveBeenCalledWith(ROUTES.addUserScreen, {
      user: expect.objectContaining({ name: 'Alice' }),
    });

    let managerTree: ReactTestRenderer.ReactTestRenderer;
    ReactTestRenderer.act(() => {
      managerTree = ReactTestRenderer.create(
        sectionList.props.renderItem({
          item: { id: '2', name: 'Bob', role: 'Manager', email: 'b@b.com' },
          index: 1,
          section: { title: 'B', data: [] },
        }),
      );
    });
    const managerRoleText = managerTree!.root.findAllByType('Text').map(n => n.props.children);
    expect(managerRoleText).not.toContain('Manager');
  });
});
