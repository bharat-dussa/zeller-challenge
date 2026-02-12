import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import Animated, {
  Easing,
  interpolate,
  interpolateColor,
  SharedValue,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import { colors } from '../utils/color.util';
import { t } from '../utils/t';
import SearchIcon from './icons/search.icon';

type TabItemProps = {
  label: string;
  index: number;
  tabWidth: number;
  animatedIndex: SharedValue<number>;
  onPress: (index: number) => void;
  setTabWidth: (width: number) => void;
};

type TabBarProps = {
  animatedIndex: SharedValue<number>;
  tabs: readonly string[];
  onPress: (idx: number) => void;
  search?: boolean;
  searchQuery?: string;
  onSearch?: (text: string) => void;
};

const TabItem = ({
  label,
  index,
  tabWidth,
  animatedIndex,
  setTabWidth,
  onPress,
}: TabItemProps) => {
  const animatedTextStyle = useAnimatedStyle(() => ({
    color: interpolateColor(
      animatedIndex.value,
      [index - 1, index, index + 1],
      [colors.gray, colors.primary, colors.gray],
    ),
  }));

  return (
    <TouchableOpacity
      onLayout={event => {
        setTabWidth(event.nativeEvent.layout.width);
      }}
      style={[styles.tab, { width: tabWidth }]}
      onPress={() => onPress(index)}
    >
      <Animated.Text style={[styles.activeTabText, animatedTextStyle]}>
        {label}
      </Animated.Text>
    </TouchableOpacity>
  );
};

export const TabBar = ({
  animatedIndex,
  tabs = [],
  onPress,
  search,
  searchQuery,
  onSearch,
}: TabBarProps) => {
  const [tabWidth, setTabWidth] = useState(0);
  const [isSearching, setIsSearching] = useState(false);
  const searchProgress = useSharedValue(0); // 0 - tabs, 1 -search

  if (!animatedIndex) {
    throw new Error(t.error['index-required']);
  }

  const toggleSearch = () => {
    const value = searchProgress.value === 0 ? 1 : 0;
    setIsSearching(is => !is);
    searchProgress.value = withTiming(value, {
      duration: 350,
      easing: Easing.out(Easing.cubic),
    });
    onSearch?.('');
  };
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

  const tabsStyle = useAnimatedStyle(() => ({
    opacity: interpolate(searchProgress.value, [0, 1], [1, 0]),
    transform: [
      {
        translateX: interpolate(searchProgress.value, [0, 1], [0, -30]),
      },
    ],
  }));

  const searchStyle = useAnimatedStyle(() => ({
    opacity: searchProgress.value,
    transform: [
      {
        translateX: interpolate(searchProgress.value, [0, 1], [30, 0]),
      },
    ],
    position: 'absolute',
    width: '100%',
  }));

  return (
    <View style={styles.container}>
      <Animated.View style={[styles.tabsContainer, tabsStyle]}>
        <Animated.View
          style={[styles.indicator, { width: tabWidth }, indicatorStyle]}
        />
        {tabs.map((tab, index) => (
          <TabItem
            key={`${tab}-${index}`}
            label={tab}
            index={index}
            tabWidth={tabWidth}
            animatedIndex={animatedIndex}
            onPress={handlePress}
            setTabWidth={setTabWidth}
          />
        ))}
      </Animated.View>

      {search && isSearching ? (
        <Animated.View style={searchStyle}>
          <TextInput
            placeholder="Search…"
            value={searchQuery}
            onChangeText={onSearch}
            placeholderTextColor={colors.gray}
            style={styles.searchInput}
            autoFocus
          />
        </Animated.View>
      ) : null}
      {search ? (
        <TouchableOpacity onPress={toggleSearch}>
          {isSearching ? (
            <Text style={styles.cancelText}>Cancel</Text>
          ) : (
            <SearchIcon width={18} height={18} />
          )}
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
  },
  searchInput: {
    height: 40,
    paddingHorizontal: 16,
    borderRadius: 20,
    backgroundColor: colors.tabBackground,
    borderWidth: 1,
    borderColor: colors.primary,
    color: colors.primary,
  },
  cancelText: {
    color: colors.primary,
    fontWeight: '600',
    paddingRight: '4%',
  },
});
