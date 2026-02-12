import { useSharedValue } from 'react-native-reanimated';

export const useTabIndex = (initialIndex = 0) => {
  const index = useSharedValue(initialIndex);

  const setIndex = (next: number) => {
    index.value = next;
  };

  return {
    index,
    setIndex
  };
};
