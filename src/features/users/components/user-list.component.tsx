import { useNavigation } from '@react-navigation/native';
import { useMemo } from 'react';
import {
  RefreshControl,
  SectionList,
  SectionListRenderItemInfo,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { useUsers } from '../hooks/use-users.hook';
import { UserListItemVM } from '../../../shared/services/graphql/types';
import { colors } from '../../../shared/utils/color.util';
import { buildSections } from '../../../shared/utils/common';
import { ROUTES } from '../../../shared/utils/route';
import { UserItem, UserSection } from '../../../shared/utils/types';

interface RenderItem extends SectionListRenderItemInfo<UserItem, UserSection> {
  navigation: any;
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
        <Text style={styles.avatarText}>{item.name.charAt(0)}</Text>
      </View>

      <Text style={styles.name}>{item.name}</Text>
    </View>

    {item.role === 'Admin' ? (
      <Text style={styles.role}>{item.role}</Text>
    ) : null}
  </TouchableOpacity>
);

export const UserList = ({ data }: { data: UserListItemVM[] }) => {
  const { onRefresh, refreshing } = useUsers();
  const sections = useMemo(() => buildSections(data), [data]);
  const navigation = useNavigation();

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
    />
  );
};

const styles = StyleSheet.create({
  container: { padding: 16 },
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
