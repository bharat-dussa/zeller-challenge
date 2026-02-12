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
    <View style={styles.contentContainer}>
      <Text style={styles.modalText}>{title}</Text>
      <View style={styles.buttonContainer}>
        <ShowWhen condition={!!primaryButtonProps?.title}>
          <AppButton {...secondaryButtonProps!} />
        </ShowWhen>
        <ShowWhen condition={!!secondaryButtonProps?.title}>
          <AppButton {...primaryButtonProps!} />
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
