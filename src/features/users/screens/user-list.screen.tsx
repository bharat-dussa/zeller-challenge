import React, { useCallback, useRef, useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import PagerView from 'react-native-pager-view';
import { SafeAreaView } from 'react-native-safe-area-context';
import { FloatingButton } from '../../../shared/components/floating-button.component';
import {
  TabBar,
  TabBarRef,
} from '../../../shared/components/tab-bar.component';
import { useAppNavigation } from '../../../shared/hooks/use-app-navigation.hook';
import { TABS } from '../../../shared/utils/common';
import { ROUTES } from '../../../shared/utils/route';
import { UserList } from '../components/user-list.component';

const UserListScreen = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTabIndex, setActiveTabIndex] = useState(0);
  const pagerRef = useRef<PagerView>(null);
  const tabSwipeRef = useRef<TabBarRef>(null);

  const navigation = useAppNavigation();

  const onTabPress = useCallback((idx: number) => {
    setActiveTabIndex(prev => (prev === idx ? prev : idx));
    tabSwipeRef.current?.setIndex(idx);
    pagerRef.current?.setPage(idx);
  }, []);

  const onPageSelected = useCallback((idx: number) => {
    setActiveTabIndex(prev => (prev === idx ? prev : idx));
    tabSwipeRef.current?.setIndex(idx);
  }, []);

  const onPressUserAdd = useCallback(() => {
    onTabPress(0); // reset list tab
    navigation.navigate(ROUTES.addUserScreen);
  }, [navigation, onTabPress]);

  let [count, setCount] = useState(0);

  const onPress = () => {
    count = count + 1;
    setCount(count + 1);
  };
  return (
    <SafeAreaView testID="user-list-screen" style={styles.flex}>
      <View testID="user-list-tab-container" style={styles.tabContainer}>
        <Pressable onPress={onPress}>
          <Text>{count}</Text>
        </Pressable>
        <TabBar
          ref={tabSwipeRef}
          tabs={TABS}
          onPress={onTabPress}
          onSearch={setSearchQuery}
          search
          searchQuery={searchQuery}
        />
      </View>
      <PagerView
        testID="user-list-pager"
        ref={pagerRef}
        style={styles.flex}
        initialPage={0}
        offscreenPageLimit={1}
        onPageSelected={e => {
          onPageSelected(e.nativeEvent.position);
        }}
      >
        {TABS.map((role, idx) => (
          <UserList
            key={`${role}-${idx}`}
            testID={`user-list-page-${idx}`}
            role={role}
            searchQuery={idx === activeTabIndex ? searchQuery : ''}
          />
        ))}
      </PagerView>
      <FloatingButton testID="user-list-add-button" onPress={onPressUserAdd} />
    </SafeAreaView>
  );
};

export default UserListScreen;

const styles = StyleSheet.create({
  flex: { flex: 1 },
  tabContainer: { paddingHorizontal: 24 },
});
