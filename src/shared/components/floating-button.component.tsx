import React from 'react';
import { Platform, StyleSheet, Text, TouchableOpacity } from 'react-native';
import { colors } from '../utils/color.util';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

type Props = {
  onPress: () => void;
  testID?: string;
};

export const FloatingButton = ({ onPress, testID = 'floating-button' }: Props) => {
  const { bottom } = useSafeAreaInsets();

  return (
    <TouchableOpacity
      testID={testID}
      activeOpacity={0.85}
      onPress={onPress}
      style={[styles.fab, { bottom: bottom + 24 }]}
    >
      <Text testID={`${testID}-icon`} style={styles.plus}>
        +
      </Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  fab: {
    position: 'absolute',
    right: 20,
    width: 56,
    height: 56,
    borderRadius: 14,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    ...(Platform.OS === 'android'
      ? {
          elevation: 6,
        }
      : {
          shadowColor: '#000',
          shadowOpacity: 0.2,
          shadowRadius: 6,
          shadowOffset: { width: 0, height: 3 },
        }),
  },
  plus: {
    color: colors.cardBackground,
    fontSize: 28,
    fontWeight: '600',
    lineHeight: 30,
  },
});
