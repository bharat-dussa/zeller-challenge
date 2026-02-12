import React, { useEffect } from 'react';
import { Dimensions, Modal, Pressable, StyleSheet, View } from 'react-native';
import Animated, {
  interpolate,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import { colors } from '../utils/color.util';

const { height } = Dimensions.get('window');

type BottomSheetModalProps = {
  visible: boolean;
  onClose: () => void;
  children: React.ReactNode;
};

export const AppBottomSheet = ({
  visible,
  onClose,
  children,
}: BottomSheetModalProps) => {
  const progress = useSharedValue(0);

  useEffect(() => {
    progress.value = withTiming(visible ? 1 : 0, { duration: 300 });
  }, [progress, visible]);

  const backdropStyle = useAnimatedStyle(() => ({
    opacity: interpolate(progress.value, [0, 1], [0, 0.5]),
  }));

  const sheetStyle = useAnimatedStyle(() => ({
    transform: [
      {
        translateY: interpolate(progress.value, [0, 1], [height, 0]),
      },
    ],
  }));

  return (
    <Modal
      testID="app-bottom-sheet-modal"
      visible={visible}
      transparent
      animationType="none"
      onRequestClose={onClose}
    >
      <View testID="app-bottom-sheet-container" style={styles.container}>
        <Animated.View
          testID="app-bottom-sheet-backdrop"
          style={[styles.backdrop, backdropStyle]}
        >
          <Pressable
            testID="app-bottom-sheet-backdrop-pressable"
            style={styles.flex}
            onPress={onClose}
          />
        </Animated.View>

        <Animated.View testID="app-bottom-sheet-sheet" style={[styles.sheet, sheetStyle]}>
          <View testID="app-bottom-sheet-handle" style={styles.handle} />
          {children}
        </Animated.View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-end',
  },

  backdrop: {
    ...StyleSheet.absoluteFill,
    backgroundColor: 'black',
  },

  sheet: {
    backgroundColor: colors.cardBackground,
    padding: 20,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    minHeight: 150,
  },

  handle: {
    width: 40,
    height: 4,
    backgroundColor: colors.gray,
    alignSelf: 'center',
    borderRadius: 2,
    marginBottom: 16,
  },

  flex: { flex: 1 },
});
