import { useMemo } from 'react';
import {
  RefreshControl,
  SectionList,
  SectionListRenderItem,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { useUsers } from '../hooks/use-users.hook';
import { UserListItemVM } from '../services/graphql/types';
import { colors } from '../utils/color.util';
import { UserSection, UserItem } from '../utils/types';

const buildSections = (data: UserListItemVM[]): UserSection[] => {
  const sorted = [...data].sort((a, b) =>
    a.name.localeCompare(b.name, undefined, { sensitivity: 'base' }),
  );

  const map: Record<string, UserItem[]> = {};

  sorted.forEach(user => {
    const letter = user.name.charAt(0).toUpperCase();

    if (!map[letter]) {
      map[letter] = [];
    }

    map[letter].push({
      id: user._id || user.id,
      name: user.name,
      role: user.role,
    });
  });

  return Object.keys(map)
    .sort()
    .map(letter => ({
      title: letter,
      data: map[letter],
    }));
};

const renderItem: SectionListRenderItem<UserItem, UserSection> = ({
  item,
  index,
}) => (
  <View style={styles.card} key={index}>
    <View style={styles.cardContent}>
      <View style={styles.avatar}>
        <Text style={styles.avatarText}>{item.name.charAt(0)}</Text>
      </View>

      <Text style={styles.name}>{item.name}</Text>
    </View>

    {item.role === 'Admin' ? (
      <Text style={styles.role}>{item.role}</Text>
    ) : null}
  </View>
);

export const UserList = ({ data }: { data: UserListItemVM[] }) => {
  const { onRefresh, refreshing } = useUsers();
  const sections = useMemo(() => buildSections(data), [data]);

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
      renderItem={renderItem}
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
