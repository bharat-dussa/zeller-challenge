import React from 'react';
import ReactTestRenderer from 'react-test-renderer';
import AddUser from '../../../src/features/users/components/add-user.component';
import { ROLES } from '../../../src/shared/utils/common';

const mockCreateUser = jest.fn();
const mockUpdateUser = jest.fn();
const mockDeleteUser = jest.fn();

let mockFormState: any = { errors: {}, isValid: true };
let mockFormData: any = {
  firstName: 'Jane',
  lastName: 'Doe',
  email: 'jane@doe.com',
  roleIndex: 0,
};
let mockUseFormArgs: any = null;

const mockIndex = { value: 0 };
const mockSetIndex = jest.fn((next: number) => {
  mockIndex.value = next;
});

let mockTabBarProps: any = null;

jest.mock('../../../src/app/providers/realm-service.context', () => ({
  useRealmService: () => ({
    createUser: mockCreateUser,
    updateUser: mockUpdateUser,
    deleteUser: mockDeleteUser,
  }),
}));

jest.mock('../../../src/shared/hooks/use-tab-index.hook', () => ({
  useTabIndex: () => [mockIndex, mockSetIndex],
}));

jest.mock('../../../src/shared/utils/common', () => ({
  ROLES: ['Admin', 'Manager'],
  getRandomUuid: () => 'uuid-1',
}));

jest.mock('../../../src/shared/components/tab-bar.component', () => {
  const React = require('react');
  return {
    TabBar: (props: any) => {
      mockTabBarProps = props;
      return React.createElement('TabBar', props, props.children);
    },
  };
});

jest.mock('react-hook-form', () => ({
  useForm: (args: any) => {
    mockUseFormArgs = args;
    return {
      control: {},
      handleSubmit: (fn: any) => () => fn(mockFormData),
      formState: mockFormState,
    };
  },
  Controller: ({ render, name }: any) =>
    render({ field: { value: '', onChange: jest.fn(), name } }),
}));

describe('components/AddUser', () => {
  beforeEach(() => {
    mockCreateUser.mockClear();
    mockUpdateUser.mockClear();
    mockDeleteUser.mockClear();
    mockSetIndex.mockClear();
    mockIndex.value = 0;
    mockTabBarProps = null;
    mockUseFormArgs = null;
    mockFormState = { errors: {}, isValid: true };
    mockFormData = {
      firstName: 'Jane',
      lastName: 'Doe',
      email: 'jane@doe.com',
      roleIndex: 0,
    };
  });

  test('uses default values for create mode', () => {
    ReactTestRenderer.act(() => {
      ReactTestRenderer.create(<AddUser isEditMode={false} />);
    });

    expect(mockUseFormArgs.defaultValues).toEqual({
      firstName: '',
      lastName: '',
      email: '',
      roleIndex: 0,
    });
  });

  test('uses default values from user in edit mode and sets index', () => {
    const user = {
      id: '1',
      name: 'Alice Smith',
      email: 'a@a.com',
      role: 'Manager',
    };

    ReactTestRenderer.act(() => {
      ReactTestRenderer.create(<AddUser isEditMode user={user as any} />);
    });

    expect(mockUseFormArgs.defaultValues).toEqual({
      firstName: 'Alice',
      lastName: 'Smith',
      email: 'a@a.com',
      roleIndex: ROLES.indexOf('Manager'),
    });
    expect(mockSetIndex).toHaveBeenCalledWith(ROLES.indexOf('Manager'));
  });

  test('shows validation errors and disables save', () => {
    mockFormState = {
      isValid: false,
      errors: {
        firstName: { message: 'First name is required' },
        lastName: { message: 'Last name is required' },
        email: { message: 'Invalid email address' },
      },
    };

    let renderer: ReactTestRenderer.ReactTestRenderer;
    ReactTestRenderer.act(() => {
      renderer = ReactTestRenderer.create(<AddUser isEditMode={false} />);
    });

    const texts = renderer!.root.findAllByType('Text').map(n => n.props.children);
    expect(texts).toContain('First name is required');
    expect(texts).toContain('Last name is required');
    expect(texts).toContain('Invalid email address');

    const saveButton = renderer!.root.findAllByType('TouchableOpacity').slice(-1)[0];
    expect(saveButton.props.disabled).toBe(true);
  });

  test('creates user on save in create mode', async () => {
    let renderer: ReactTestRenderer.ReactTestRenderer;
    ReactTestRenderer.act(() => {
      renderer = ReactTestRenderer.create(<AddUser isEditMode={false} />);
    });

    const saveButton = renderer!.root.findAllByType('TouchableOpacity').slice(-1)[0];

    await ReactTestRenderer.act(async () => {
      await saveButton.props.onPress();
    });

    expect(mockCreateUser).toHaveBeenCalledWith(
      expect.objectContaining({
        id: 'uuid-1',
        name: 'Jane Doe',
        role: ROLES[0],
      }),
    );
    expect(mockUpdateUser).not.toHaveBeenCalled();
  });

  test('updates and deletes user in edit mode', async () => {
    const user = { id: '1', name: 'Alice Smith', email: 'a@a.com', role: 'Admin' };

    let renderer: ReactTestRenderer.ReactTestRenderer;
    ReactTestRenderer.act(() => {
      renderer = ReactTestRenderer.create(<AddUser isEditMode user={user as any} />);
    });

    const buttons = renderer!.root.findAllByType('TouchableOpacity');
    const deleteButton = buttons[buttons.length - 2];
    const saveButton = buttons[buttons.length - 1];

    await ReactTestRenderer.act(async () => {
      await deleteButton.props.onPress();
    });
    expect(mockDeleteUser).toHaveBeenCalledWith('1');

    await ReactTestRenderer.act(async () => {
      await saveButton.props.onPress();
    });
    expect(mockUpdateUser).toHaveBeenCalledWith(
      expect.objectContaining({
        id: '1',
        name: 'Jane Doe',
        role: ROLES[0],
      }),
    );
  });

  test('onDelete returns early when no user', () => {
    let renderer: ReactTestRenderer.ReactTestRenderer;
    ReactTestRenderer.act(() => {
      renderer = ReactTestRenderer.create(<AddUser isEditMode={false} />);
    });

    const deleteButtons = renderer!.root
      .findAllByType('TouchableOpacity')
      .filter(node => node.props.style && node.props.style.borderColor === '#FF3B30');

    expect(deleteButtons).toHaveLength(0);
    expect(mockDeleteUser).not.toHaveBeenCalled();
  });

  test('passes tab role selection to setIndex', () => {
    ReactTestRenderer.act(() => {
      ReactTestRenderer.create(<AddUser isEditMode={false} />);
    });

    ReactTestRenderer.act(() => {
      mockTabBarProps.onPress(1);
    });
    expect(mockSetIndex).toHaveBeenCalledWith(1);
  });
});
