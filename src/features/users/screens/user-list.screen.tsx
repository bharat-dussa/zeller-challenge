import React, { useRef, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import PagerView from 'react-native-pager-view';
import { SafeAreaView } from 'react-native-safe-area-context';
import { FloatingButton } from '../../../shared/components/floating-button.component';
import { TabBar } from '../../../shared/components/tab-bar.component';
import { useAppNavigation } from '../../../shared/hooks/use-app-navigation.hook';
import { useTabIndex } from '../../../shared/hooks/use-tab-index.hook';
import { TABS } from '../../../shared/utils/common';
import { ROUTES } from '../../../shared/utils/route';
import { UserList } from '../components/user-list.component';

const UserListScreen = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const pagerRef = useRef<PagerView>(null);
  const { index, setIndex } = useTabIndex(0);
  const navigation = useAppNavigation();

  const onPress = (idx: number) => {
    setIndex(idx);
    pagerRef.current?.setPage(Number(idx));
  };

  const onPressUserAdd = () => {
    navigation.navigate(ROUTES.addUserScreen);
  };

  return (
    <SafeAreaView testID="user-list-screen" style={styles.flex}>
      <View testID="user-list-tab-container" style={styles.tabContainer}>
        <TabBar
          tabs={TABS}
          onPress={onPress}
          onSearch={setSearchQuery}
          search
          searchQuery={searchQuery}
          animatedIndex={index}
        />
      </View>

      <PagerView
        testID="user-list-pager"
        ref={pagerRef}
        style={styles.flex}
        initialPage={0}
        onPageSelected={e => {
          onPress(e.nativeEvent.position);
        }}
      >
        {TABS.map((role, idx) => (
          <UserList
            key={`${role}-${idx}`}
            testID={`user-list-page-${idx}`}
            role={role}
            searchQuery={searchQuery}
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
