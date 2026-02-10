import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { colors } from '../utils/color.util';

export const Loader = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>Loading...</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  text: { color: colors.primary },
});
