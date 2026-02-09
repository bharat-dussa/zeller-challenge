import { useNavigation } from '@react-navigation/native';
import React, { useRef, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import PagerView from 'react-native-pager-view';
import { SharedValue } from 'react-native-reanimated';
import { SafeAreaView } from 'react-native-safe-area-context';
import { FloatingButton } from '../../components/floating-button.component';
import { Loader } from '../../components/loader.component';
import { TabBar } from '../../components/tab-bar.component';
import { UserList } from '../../components/user-list.component';
import { useTabIndex } from '../../hooks/use-tab-index.hook';
import { useUsers } from '../../hooks/use-users.hook';
import { UserRole } from '../../services/api/users/user.models';
import { TABS } from '../../utils/common';
import { ROUTES } from '../../utils/route';
import { NoData } from '../../components/no-data.component';


const UserListScreen = () => {
  const [selectedRole, setSelectedRole] = useState<UserRole & 'All'>();
  const [searchQuery, setSearchQuery] = useState('');

  const pagerRef = useRef<PagerView>(null);
  const [index, setIndex] = useTabIndex(0);
  const navigation = useNavigation();
  const { loading, users } = useUsers(selectedRole, searchQuery);

  const onPress = (
    tabIndex: number | SharedValue<number> | ((next: number) => void),
  ) => {
    //@ts-ignore
    setSelectedRole(TABS[tabIndex]);
    //@ts-ignore
    setIndex(tabIndex as SharedValue<number>);
    pagerRef.current?.setPage(Number(tabIndex));
  };

  const onPressUserAdd = () => {
    //@ts-ignore
    navigation.navigate(ROUTES.addUserScreen);
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.tabContainer}>
        <TabBar
          tabs={TABS}
          onPress={onPress}
          onSearch={setSearchQuery}
          search
          searchQuery={searchQuery}
          animatedIndex={index as SharedValue<number>}
        />
      </View>
      {loading ? (
        <Loader />
      ) : (
        <>
          {searchQuery.length > 1 && users.length === 0 ? (
            <NoData />
          ) : (
            <PagerView
              ref={pagerRef}
              style={styles.pagerView}
              initialPage={0}
              onPageSelected={e => {
                onPress(e.nativeEvent.position);
              }}
            >
              <UserList key="1" data={users} />
              <UserList key="2" data={users} />
              <UserList key="3" data={users} />
            </PagerView>
          )}

          <FloatingButton onPress={onPressUserAdd} />
        </>
      )}
    </SafeAreaView>
  );
};

export default UserListScreen;

const styles = StyleSheet.create({
  container: { flex: 1 },
  pagerView: {
    flex: 1,
  },
  userList: {
    flex: 1,
  },
  safeArea: {
    flex: 1,
  },
  tabContainer: { paddingHorizontal: 24 },
});
