import React from 'react';
import { fireEvent, render, screen, waitFor } from '@testing-library/react-native';
import AddUser from '../../../src/features/users/components/add-user.component';
import { t } from '../../../src/shared/utils/t';

const mockCreateUser = jest.fn();
const mockUpdateUser = jest.fn();
const mockDeleteUser = jest.fn();
const mockGoBack = jest.fn();
const mockSetValue = jest.fn();

let mockFormState: any = { errors: {}, isValid: true };
let mockFormData: any = {
  firstName: 'Jane',
  lastName: 'Doe',
  email: 'jane@doe.com',
  role: 'Admin',
};

jest.mock('../../../src/app/providers/realm-service.context', () => ({
  useRealmService: () => ({
    createUser: mockCreateUser,
    updateUser: mockUpdateUser,
    deleteUser: mockDeleteUser,
  }),
}));

jest.mock('../../../src/shared/hooks/use-app-navigation.hook', () => ({
  useAppNavigation: () => ({
    goBack: mockGoBack,
  }),
}));

jest.mock('react-hook-form', () => ({
  useForm: () => ({
    control: {},
    handleSubmit: (fn: any) => () => {
      if (!mockFormState.isValid) return;
      return fn(mockFormData);
    },
    trigger: jest.fn(),
    setValue: mockSetValue.mockImplementation((name: string, value: any) => {
      mockFormData[name] = value;
    }),
    formState: mockFormState,
  }),
  Controller: ({ render, name }: any) => {
    const onChange = (value: any) => {
      mockFormData[name] = value;
    };

    return render({ field: { value: mockFormData[name] ?? '', onChange, name } });
  },
}));

describe('components/AddUser', () => {
  beforeEach(() => {
    mockCreateUser.mockClear();
    mockUpdateUser.mockClear();
    mockDeleteUser.mockClear();
    mockGoBack.mockClear();
    mockSetValue.mockClear();

    mockFormState = { errors: {}, isValid: true };
    mockFormData = {
      firstName: 'Jane',
      lastName: 'Doe',
      email: 'jane@doe.com',
      role: 'Admin',
    };
  });

  test('renders create mode fields and hides delete button', () => {
    render(<AddUser isEditMode={false} />);

    expect(screen.getByTestId('add-user-screen')).toBeTruthy();
    expect(screen.getByTestId('add-user-first-name-input')).toBeTruthy();
    expect(screen.getByTestId('add-user-last-name-input')).toBeTruthy();
    expect(screen.getByTestId('add-user-email-input')).toBeTruthy();
    expect(screen.queryByTestId('add-user-delete-button')).toBeNull();
  });

  test('creates user on save in create mode', async () => {
    render(<AddUser isEditMode={false} />);

    fireEvent.press(screen.getByTestId('add-user-save-button'));

    await waitFor(() => {
      expect(mockCreateUser).toHaveBeenCalledWith(
        expect.objectContaining({
          id: 'uuid',
          name: 'Jane Doe',
          email: 'jane@doe.com',
          role: 'Admin',
        }),
      );
    });

    expect(mockUpdateUser).not.toHaveBeenCalled();
    expect(mockGoBack).toHaveBeenCalled();
  });

  test('updates role when tab is pressed', async () => {
    render(<AddUser isEditMode={false} />);

    fireEvent.press(screen.getByTestId('tab-item-1'));
    fireEvent.press(screen.getByTestId('add-user-save-button'));

    await waitFor(() => {
      expect(mockSetValue).toHaveBeenCalledWith('role', 'Manager', {
        shouldValidate: true,
      });
      expect(mockCreateUser).toHaveBeenCalledWith(
        expect.objectContaining({
          role: 'Manager',
        }),
      );
    });
  });

  test('updates user in edit mode', async () => {
    mockFormData = {
      firstName: 'Alice',
      lastName: 'Smith',
      email: 'alice@new.com',
      role: 'Manager',
    };
    const user = {
      id: '1',
      name: 'Alice Smith',
      firstName: 'Alice',
      lastName: 'Smith',
      email: 'alice@example.com',
      role: 'Manager',
    };

    render(<AddUser isEditMode user={user as any} />);

    fireEvent.press(screen.getByTestId('add-user-save-button'));

    await waitFor(() => {
      expect(mockUpdateUser).toHaveBeenCalledWith(
        expect.objectContaining({
          id: '1',
          name: 'Alice Smith',
          email: 'alice@new.com',
          role: 'Manager',
        }),
      );
    });

    expect(mockCreateUser).not.toHaveBeenCalled();
  });

  test('renders field-level validation errors', () => {
    mockFormState = {
      isValid: false,
      errors: {
        firstName: { message: 'First name is required' },
        lastName: { message: 'Last name is required' },
        email: { message: 'Invalid email address' },
      },
    };

    render(<AddUser isEditMode={false} />);

    expect(screen.getByText('First name is required')).toBeTruthy();
    expect(screen.getByText('Last name is required')).toBeTruthy();
    expect(screen.getByText('Invalid email address')).toBeTruthy();
  });

  test('uses fallback id paths in edit mode save', async () => {
    const userWithUnderscoreId = {
      _id: 'zeller-id',
      name: 'Legacy User',
      firstName: 'Legacy',
      lastName: 'User',
      email: 'legacy@zeller.com',
      role: 'Admin',
    };

    const view = render(<AddUser isEditMode user={userWithUnderscoreId as any} />);
    fireEvent.press(screen.getByTestId('add-user-save-button'));

    await waitFor(() => {
      expect(mockUpdateUser).toHaveBeenCalledWith(
        expect.objectContaining({
          id: 'zeller-id',
        }),
      );
    });

    mockUpdateUser.mockClear();
    view.unmount();
    render(<AddUser isEditMode />);
    fireEvent.press(screen.getByTestId('add-user-save-button'));

    await waitFor(() => {
      expect(mockUpdateUser).toHaveBeenCalledWith(
        expect.objectContaining({
          id: '',
        }),
      );
    });
  });

  test('shows invalid-form bottom sheet on close in edit mode', async () => {
    mockFormState = { errors: {}, isValid: false };
    const user = {
      id: '1',
      name: 'Alice Smith',
      firstName: 'Alice',
      lastName: 'Smith',
      email: 'alice@zeller.com',
      role: 'Admin',
    };

    render(<AddUser isEditMode user={user as any} />);
    fireEvent.press(screen.getByTestId('add-user-close-button'));

    await waitFor(() => {
      expect(screen.getByTestId('bottom-sheet-content-title').props.children).toBe(
        t.messages['please-clear-form-errors'],
      );
    });
  });

  test('deletes user through confirmation sheet', async () => {
    const user = {
      id: '1',
      name: 'Alice Smith',
      firstName: 'Alice',
      lastName: 'Smith',
      email: 'alice@zeller.com',
      role: 'Admin',
    };

    render(<AddUser isEditMode user={user as any} />);
    fireEvent.press(screen.getByTestId('add-user-delete-button'));

    await waitFor(() => {
      expect(screen.getByTestId('bottom-sheet-content-title').props.children).toBe(
        t.messages['delete-user-prompt'],
      );
      expect(screen.getByTestId('bottom-sheet-secondary-button')).toBeTruthy();
    });

    fireEvent.press(screen.getByTestId('bottom-sheet-secondary-button'));

    await waitFor(() => {
      expect(mockDeleteUser).toHaveBeenCalledWith('1');
    });
  });

  test('delete action returns early when user is missing', async () => {
    render(<AddUser isEditMode />);
    fireEvent.press(screen.getByTestId('add-user-delete-button'));

    await waitFor(() => {
      expect(screen.getByTestId('bottom-sheet-secondary-button')).toBeTruthy();
    });

    fireEvent.press(screen.getByTestId('bottom-sheet-secondary-button'));
    expect(mockDeleteUser).not.toHaveBeenCalled();
  });
});
