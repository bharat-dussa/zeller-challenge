import { useNavigation } from '@react-navigation/native';
import { renderHook } from '@testing-library/react-native';

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
    const { result } = renderHook(() => useNavigation());

    expect(mockUseNavigation).toHaveBeenCalledTimes(1);
    expect(result.current).toBe(mockNavigation);
  });
});
