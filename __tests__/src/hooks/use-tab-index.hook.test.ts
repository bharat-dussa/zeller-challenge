import { act, renderHook } from '@testing-library/react-native';
import { useTabIndex } from '../../../src/shared/hooks/use-tab-index.hook';

describe('hooks/use-tab-index', () => {
  test('initializes with default value and updates index', () => {
    const { result } = renderHook(() => useTabIndex(0));

    expect(result.current.index.value).toBe(0);

    act(() => {
      result.current.setIndex(4);
    });

    expect(result.current.index.value).toBe(4);
  });

  test('respects a custom initial value', () => {
    const { result } = renderHook(() => useTabIndex(2));

    expect(result.current.index.value).toBe(2);
  });

  test('respects a default initial value', () => {
    const { result } = renderHook(() => useTabIndex());

    expect(result.current.index.value).toBe(0);
  });
});
