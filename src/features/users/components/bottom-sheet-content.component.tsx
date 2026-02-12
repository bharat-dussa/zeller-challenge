import React, { FC } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import {
  AppButton,
  AppButtonProps,
} from '../../../shared/components/app-button.component';
import { ShowWhen } from '../../../shared/components/show-when.component';

interface BottomSheetContentProps {
  title: string;
  primaryButtonProps?: AppButtonProps;
  secondaryButtonProps?: AppButtonProps;
}
export const BottomSheetContent: FC<BottomSheetContentProps> = ({
  title,
  primaryButtonProps,
  secondaryButtonProps,
}) => {
  return (
    <View testID="bottom-sheet-content" style={styles.contentContainer}>
      <Text testID="bottom-sheet-content-title" style={styles.modalText}>
        {title}
      </Text>
      <View testID="bottom-sheet-content-buttons" style={styles.buttonContainer}>
        <ShowWhen condition={!!secondaryButtonProps?.title}>
          <AppButton testID="bottom-sheet-secondary-button" {...secondaryButtonProps!} />
        </ShowWhen>
        <ShowWhen condition={!!primaryButtonProps?.title}>
          <AppButton testID="bottom-sheet-primary-button" {...primaryButtonProps!} />
        </ShowWhen>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  contentContainer: {
    gap: 40,
    justifyContent: 'center',
  },
  modalText: { fontWeight: '600' },
  buttonContainer: {
    paddingHorizontal: 10,
  },
});
