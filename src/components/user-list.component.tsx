import { FlatList, RefreshControl, StyleSheet, Text, View } from 'react-native';
import { colors } from '../utils/color.util';
import { useUsers } from '../hooks/use-users.hook';
import { useMemo } from 'react';

const renderItem = ({
  item,
  index,
  userData,
}: {
  item: any;
  index: number;
}) => (
  <>
    {index === 0 || userData[index - 1].letter !== item.letter ? (
      <Text style={styles.letter}>{item.letter}</Text>
    ) : null}

    <View style={styles.card}>
      <View style={styles.cardContent}>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>{item.letter}</Text>
        </View>

        <Text style={styles.name}>{item.name}</Text>
      </View>
      {item.role === 'Admin' ? (
        <Text style={styles.role}>{item.role}</Text>
      ) : null}
    </View>
  </>
);

export const UserList = ({ data }) => {
  const { loading, users, onRefresh, refreshing } = useUsers();

  const userData = useMemo(() => {
    return users.map(user => ({
      letter: user.name[0],
      name: user.name,
      role: user.role,
      id: user.id,
    }));
  }, [users]);

  console.log(refreshing);
  return (
    <FlatList
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
      contentContainerStyle={styles.container}
      data={data}
      keyExtractor={(item, index) => item.letter + index.toString()}
      renderItem={({ item, index }) => renderItem({ item, index, userData })}
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
