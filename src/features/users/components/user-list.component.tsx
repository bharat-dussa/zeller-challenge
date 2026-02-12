import { FC, useMemo } from 'react';
import {
  RefreshControl,
  SectionList,
  SectionListRenderItemInfo,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { Loader } from '../../../shared/components/loader.component';
import { NoData } from '../../../shared/components/no-data.component';
import { useAppNavigation } from '../../../shared/hooks/use-app-navigation.hook';
import { UserRoleWithAll } from '../../../shared/models/user.models';
import { ZellerCustomer } from '../../../shared/services/graphql/types';
import { colors } from '../../../shared/utils/color.util';
import { buildSections } from '../../../shared/utils/common';
import { ROUTES } from '../../../shared/utils/route';
import { useUsers } from '../hooks/use-users.hook';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../../app/navigation/type';

export type UserItem = Pick<
  ZellerCustomer,
  'email' | 'id' | 'name' | 'role' | '_id'
>;

export type UserSection = {
  title: string;
  data: UserItem[];
};

interface RenderItem extends SectionListRenderItemInfo<UserItem, UserSection> {
  navigation: NativeStackNavigationProp<RootStackParamList>;
}

interface UserListProps {
  role: UserRoleWithAll;
  searchQuery?: string;
}

const renderItem = ({ item, index, navigation }: RenderItem) => (
  <TouchableOpacity
    style={styles.card}
    key={index}
    onPress={() =>
      navigation.navigate(ROUTES.addUserScreen, {
        user: item,
      })
    }
  >
    <View style={styles.cardContent}>
      <View style={styles.avatar}>
        <Text style={styles.avatarText}>{item?.name?.charAt(0)}</Text>
      </View>

      <Text style={styles.name}>{item?.name}</Text>
    </View>

    {item?.role === 'Admin' ? (
      <Text style={styles.role}>{item.role}</Text>
    ) : null}
  </TouchableOpacity>
);

export const UserList: FC<UserListProps> = ({ role, searchQuery = '' }) => {
  const { onRefresh, refreshing, users, loading } = useUsers(role, searchQuery);
  const sections = useMemo(() => buildSections(users), [users]);
  const navigation = useAppNavigation();

  if (loading) {
    return <Loader />;
  }

  return (
    <SectionList
      sections={sections}
      keyExtractor={item => item.id + item.name}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
      contentContainerStyle={styles.container}
      renderSectionHeader={({ section }) => (
        <Text style={styles.letter}>{section.title}</Text>
      )}
      renderItem={props => renderItem({ ...props, navigation })}
      ListEmptyComponent={NoData}
    />
  );
};

const styles = StyleSheet.create({
  container: { padding: 16, height: '100%' },
  title: { fontSize: 18, fontWeight: '700', marginBottom: 12 },
  letter: { fontSize: 16, marginVertical: 12 },
  card: {
    padding: 16,
    borderBottomWidth: 2,
    borderBottomColor: colors.background,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  name: { fontSize: 14 },
  role: { color: colors.gray },
  cardContent: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  avatar: {
    padding: 14,
    borderRadius: 10,
    backgroundColor: colors.tabBackground,
    paddingHorizontal: 16,
    paddingVertical: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarText: { color: colors.primary, fontWeight: '700' },
});
