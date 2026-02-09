jest.mock('react-native', () => {
  const React = require('react');
  const RN = require('react-native/jest/mock');

  const View = (props: any) => React.createElement('View', props, props.children);
  const Text = (props: any) => React.createElement('Text', props, props.children);
  const TouchableOpacity = (props: any) =>
    React.createElement('TouchableOpacity', props, props.children);
  const TextInput = (props: any) => React.createElement('TextInput', props, props.children);

  return {
    ...RN,
    View,
    Text,
    TouchableOpacity,
    TextInput,
    StyleSheet: { create: (styles: any) => styles },
    Platform: { OS: 'ios', select: (obj: any) => obj.ios ?? obj.default },
    useColorScheme: () => 'light',
    StatusBar: () => null,
    RefreshControl: (props: any) => React.createElement('RefreshControl', props),
    SectionList: (props: any) => React.createElement('SectionList', props),
  };
});

jest.mock('react-native-reanimated', () => {
  const React = require('react');
  const RN = require('react-native');
  const Animated = {
    View: React.forwardRef((props, ref) => React.createElement(RN.View, { ...props, ref })),
    Text: React.forwardRef((props, ref) => React.createElement(RN.Text, { ...props, ref })),
  };

  return {
    __esModule: true,
    default: Animated,
    Easing: {
      out: (fn: any) => fn,
      cubic: () => {},
      bezier: () => {},
    },
    interpolate: () => 0,
    interpolateColor: () => 'transparent',
    useAnimatedStyle: (fn: any) => fn(),
    useSharedValue: (v: any) => ({ value: v }),
    withTiming: (v: any) => v,
  };
});

jest.mock('react-native-pager-view', () => {
  const React = require('react');
  return ({ children, ...props }) => React.createElement('PagerView', props, children);
});

jest.mock('react-native-svg', () => ({
  SvgXml: () => null,
}));

jest.mock('react-native-get-random-values', () => ({}));

jest.mock('uuid', () => ({ v4: () => 'uuid' }));

jest.mock('@react-navigation/native', () => ({
  NavigationContainer: ({ children }) => children,
  useNavigation: () => ({ navigate: jest.fn(), pop: jest.fn() }),
  useRoute: () => ({ params: {} }),
}));

jest.mock('@react-navigation/native-stack', () => ({
  createNativeStackNavigator: () => ({
    Navigator: ({ children }) => children,
    Screen: ({ children }) => children,
  }),
}));

jest.mock('react-native-safe-area-context', () => ({
  SafeAreaProvider: ({ children }) => children,
  SafeAreaView: ({ children }) => children,
  useSafeAreaInsets: () => ({ top: 0, bottom: 0, left: 0, right: 0 }),
}));

const realmInstance = {};

jest.mock('@realm/react', () => ({
  Realm: { Object: class {} },
  createRealmContext: () => ({
    RealmProvider: ({ children }) => children,
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
