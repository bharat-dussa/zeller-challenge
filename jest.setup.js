global.window = global.window || {};
global.window.dispatchEvent = global.window.dispatchEvent || (() => {});

const mockReact = require('react');

jest.mock('react-native-reanimated', () => {
  const { Text, View } = require('react-native');

  const interpolate = (value, inputRange, outputRange) => {
    if (!inputRange?.length || !outputRange?.length) return value;
    if (inputRange.length === 1) return outputRange[0];
    const min = inputRange[0];
    const max = inputRange[inputRange.length - 1];
    if (value <= min) return outputRange[0];
    if (value >= max) return outputRange[outputRange.length - 1];
    const ratio = (value - min) / (max - min);
    return (
      outputRange[0] +
      ratio * (outputRange[outputRange.length - 1] - outputRange[0])
    );
  };

  return {
    __esModule: true,
    default: {
      View,
      Text,
    },
    Easing: {
      out: fn => fn,
      cubic: value => value,
      bezier: () => value => value,
    },
    useSharedValue: initial => {
      const ref = mockReact.useRef({ value: initial });
      return ref.current;
    },
    useDerivedValue: updater => ({ value: updater() }),
    useAnimatedStyle: updater => updater(),
    withTiming: value => value,
    interpolate,
    interpolateColor: (_value, _inputRange, outputRange) =>
      outputRange[1] ?? outputRange[0],
  };
});

jest.mock(
  'react-native-pager-view',
  () =>
    ({ children, ...props }) =>
      mockReact.createElement('PagerView', props, children),
);

jest.mock('react-native-svg', () => ({
  SvgXml: jest.fn(() => null),
}));

jest.mock('react-native-get-random-values', () => ({}));

jest.mock('uuid', () => ({ v4: () => 'uuid' }));

jest.mock('@react-navigation/native', () => ({
  NavigationContainer: ({ children, ...props }) =>
    mockReact.createElement('NavigationContainer', props, children),
  useNavigation: () => ({
    navigate: jest.fn(),
    pop: jest.fn(),
    goBack: jest.fn(),
  }),
  useRoute: () => ({ params: {} }),
}));

jest.mock('@react-navigation/native-stack', () => ({
  createNativeStackNavigator: () => ({
    Navigator: ({ children, ...props }) =>
      mockReact.createElement('StackNavigator', props, children),
    Screen: ({ children, ...props }) =>
      mockReact.createElement('StackScreen', props, children),
  }),
}));

jest.mock('react-native-safe-area-context', () => ({
  SafeAreaProvider: ({ children, ...props }) =>
    mockReact.createElement('SafeAreaProvider', props, children),
  SafeAreaView: ({ children, ...props }) =>
    mockReact.createElement('SafeAreaView', props, children),
  useSafeAreaInsets: () => ({ top: 0, bottom: 0, left: 0, right: 0 }),
}));

const realmInstance = {};

jest.mock('@realm/react', () => ({
  Realm: { Object: class {} },
  createRealmContext: () => ({
    RealmProvider: ({ children, ...props }) =>
      mockReact.createElement('RealmProvider', props, children),
    useRealm: () => realmInstance,
    useQuery: () => [],
    useObject: () => null,
  }),
}));

jest.mock('realm', () => ({
  __esModule: true,
  default: {
    UpdateMode: { Modified: 'modified' },
    open: jest.fn(async () => ({})),
  },
}));
