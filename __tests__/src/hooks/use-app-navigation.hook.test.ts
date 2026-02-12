import { renderHook } from '@testing-library/react-native';
import { useAppNavigation } from '../../../src/shared/hooks/use-app-navigation.hook';

const mockNavigation = {
  navigate: jest.fn(),
  goBack: jest.fn(),
  pop: jest.fn(),
};

const mockUseNavigation = jest.fn(() => mockNavigation);

jest.mock('@react-navigation/native', () => ({
  useNavigation: () => mockUseNavigation(),
}));

describe('useAppNavigation', () => {
  beforeEach(() => {
    mockUseNavigation.mockClear();
    mockNavigation.navigate.mockClear();
    mockNavigation.goBack.mockClear();
    mockNavigation.pop.mockClear();
  });

  it('returns navigation instance', () => {
    const { result } = renderHook(() => useAppNavigation());

    expect(mockUseNavigation).toHaveBeenCalledTimes(1);
    expect(result.current).toBe(mockNavigation);
  });
});
