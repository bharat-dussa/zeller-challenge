import React from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import { colors } from '../utils/color.util';

const AppButton = ({ onPress }) => {
  return <TouchableOpacity style={styles.buttonContainer} onPress={onPress} />;
};

const styles = StyleSheet.create({
  buttonContainer: {
    backgroundColor: colors.primary,
  },
});

export default AppButton;
