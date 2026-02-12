import React from 'react';
import {
  StyleSheet,
  Text,
  TextStyle,
  TouchableOpacity,
  View,
  ViewStyle
} from 'react-native';
import { colors } from '../utils/color.util';
import { Loader } from './loader.component';

export type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'label';

export type AppButtonProps = {
  title: string;
  onPress?: () => void;
  testID?: string;

  variant?: ButtonVariant;
  loading?: boolean;
  disabled?: boolean;
  fullWidth?: boolean;

  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;

  style?: ViewStyle;
  textStyle?: TextStyle;
};

export const AppButton = ({
  title,
  onPress,
  testID = 'app-button',
  variant = 'primary',
  loading = false,
  disabled = false,
  fullWidth = true,
  leftIcon,
  rightIcon,
  style,
  textStyle,
}: AppButtonProps) => {
  const isDisabled = disabled || loading;
  const containerVariantStyleMap = {
    primary: styles.primary,
    secondary: styles.secondary,
    outline: styles.outline,
    label: styles.label,
  };
  const textVariantStyleMap = {
    primary: styles.primaryText,
    secondary: styles.secondaryText,
    outline: styles.outlineText,
    label: styles.labelText,
  };

  const containerStyles = [
    styles.base,
    fullWidth && styles.fullWidth,
    containerVariantStyleMap[variant],
    isDisabled && styles.disabled,
    style,
  ];

  const textStyles = [
    styles.textBase,
    textVariantStyleMap[variant],
    isDisabled && styles.disabledText,
    textStyle,
  ];

  return (
    <TouchableOpacity
      testID={testID}
      activeOpacity={0.8}
      onPress={onPress}
      disabled={isDisabled}
      style={containerStyles}
    >
      {loading ? (
        <Loader />
      ) : (
        <View style={styles.content}>
          {leftIcon}
          <Text testID={`${testID}-label`} style={textStyles}>
            {title}
          </Text>
          {rightIcon}
        </View>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  base: {
    paddingVertical: 14,
    borderRadius: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },

  fullWidth: {
    width: '100%',
  },

  content: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },

  textBase: {
    fontSize: 16,
    fontWeight: '600',
  },

  primary: {
    backgroundColor: colors.primary,
  },

  primaryText: {
    color: colors.cardBackground,
  },

  secondary: {
    backgroundColor: colors.tabBackground,
  },

  secondaryText: {
    color: colors.primary,
  },

  outline: {
    borderWidth: 1,
    borderColor: colors.primary,
    backgroundColor: 'transparent',
  },

  outlineText: {
    color: colors.primary,
  },

  label: {
    backgroundColor: 'transparent',
    paddingVertical: 8,
  },

  labelText: {
    color: colors.primary,
  },

  disabled: {
    opacity: 0.5,
  },

  disabledText: {
    opacity: 0.7,
  },
});
