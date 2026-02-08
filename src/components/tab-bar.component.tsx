import React, { useState } from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import Animated, {
  Easing,
  interpolateColor,
  SharedValue,
  useAnimatedStyle,
  withTiming
} from 'react-native-reanimated';
import { colors } from '../utils/color.util';
import SearchIcon from './icons/search.icon';

export const TabBar = ({
  animatedIndex,
  tabs = [],
  onPress,
  search,
}: {
  animatedIndex: SharedValue<number>;
  tabs: string[];
  onPress: (tabIndex: number) => void;
  search?: boolean;
}) => {
  const [tabWidth, setTabWidth] = useState(0);
  if (!animatedIndex) {
    throw new Error('Index is required');
  }

  const indicatorStyle = useAnimatedStyle(() => ({
    transform: [
      {
        translateX: withTiming(animatedIndex.value * tabWidth, {
          duration: 500,
          easing: Easing.bezier(0.25, 0.1, 0.25, 1.0),
        }),
      },
    ],
  }));

  const handlePress = (tabIndex: number) => {
    animatedIndex.value = tabIndex;
    onPress?.(tabIndex);
  };

  
  return (
    <View style={styles.container}>
      <View style={styles.tabsContainer}>
        <Animated.View
          style={[styles.indicator, { width: tabWidth }, indicatorStyle]}
        />

        {tabs.map((tab, index) => {
          const animatedTextStyle = useAnimatedStyle(() => ({
            color: interpolateColor(
              animatedIndex.value,
              [
                animatedIndex.value - 1,
                animatedIndex.value,
                animatedIndex.value + 1,
              ],
              [colors.gray, colors.primary, colors.gray],
            ),
          }));
          return (
            <TouchableOpacity
              key={`tab-${tab}`}
              onLayout={event => {
                setTabWidth(event.nativeEvent.layout.width);
              }}
              style={[styles.tab, { width: tabWidth }]}
              onPress={() => handlePress(index)}
            >
              <Animated.Text style={[styles.activeTabText, animatedTextStyle]}>
                {tab}
              </Animated.Text>
            </TouchableOpacity>
          );
        })}
      </View>
      {search ? (
        <TouchableOpacity>
          <SearchIcon width={18} height={18} />
        </TouchableOpacity>
      ) : null}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 20,
  },
  tabsContainer: {
    flex: 1,
    flexDirection: 'row',
    backgroundColor: colors.background,
    borderRadius: 50,
  },
  activeTab: {
    backgroundColor: colors.tabBackground,
    borderColor: colors.primary,
    borderWidth: 1,
  },
  tab: {
    flex: 1,
    alignItems: 'center',
    borderRadius: 50,
    padding: 10,
    zIndex: 1,
  },
  activeTabText: { color: colors.primary, fontWeight: '700' },
  indicator: {
    position: 'absolute',
    height: '100%',
    backgroundColor: colors.tabBackground,
    borderRadius: 50,
    borderWidth: 1,
    borderColor: colors.primary,
    pointerEvents: 'none',
  },
});
