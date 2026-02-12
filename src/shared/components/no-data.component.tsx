import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { colors } from '../utils/color.util';

export const NoData = () => {
  return (
    <View testID="no-data-container" style={styles.container}>
      <Text testID="no-data-text" style={styles.text}>
        No Data
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  text: { color: colors.primary },
});
