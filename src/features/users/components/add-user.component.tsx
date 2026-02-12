import { zodResolver } from '@hookform/resolvers/zod';
import React, { FC, useEffect, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import {
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRealmService } from '../../../app/providers/realm-service.context';
import { AppButton } from '../../../shared/components/app-button.component';
import { AppBottomSheet } from '../../../shared/components/app-modal.component';
import CloseIcon from '../../../shared/components/icons/close.icon';
import { TabBar } from '../../../shared/components/tab-bar.component';
import { useAppNavigation } from '../../../shared/hooks/use-app-navigation.hook';
import { useTabIndex } from '../../../shared/hooks/use-tab-index.hook';
import { ZellerCustomer } from '../../../shared/services/graphql/types';
import { colors } from '../../../shared/utils/color.util';
import { getRandomUuid, ROLES } from '../../../shared/utils/common';
import { t } from '../../../shared/utils/t';
import { AddUserForm, addUserSchema } from '../validation/user-form.schema';
import { BottomSheetContent } from './bottom-sheet-content.component';

interface AddUserProps {
  isEditMode: boolean;
  user?: ZellerCustomer;
}

export const AddUser: FC<AddUserProps> = ({ isEditMode, user }) => {
  // This is required since we are using shared value in useTabIndex.
  const initialIndex =
    user?.role && ROLES.includes(user.role) ? ROLES.indexOf(user.role) : 0;

  const { index, setIndex } = useTabIndex(initialIndex);
  const [isShowBottomsheet, setIsShowBottomsheet] = useState(false);
  const [isDeleteClicked, setIsDeleteClicked] = useState(false);
  const navigation = useAppNavigation();

  const {
    control,
    handleSubmit,
    trigger,
    setValue,
    formState: { errors, isValid },
  } = useForm<AddUserForm>({
    resolver: zodResolver(addUserSchema),
    mode: 'all',
    defaultValues: {
      firstName: user?.name?.split(' ')[0] || '',
      lastName: user?.name?.split(' ').slice(1).join(' ') || '',
      email: user?.email || '',
      role: user?.role || '',
    },
  });

  const handleBottomSheetState = (isOpen: boolean) =>
    setIsShowBottomsheet(isOpen);

  const onCloseBottomSheet = () => handleBottomSheetState(false);

  const onClose = () => {
    if (isEditMode && !isValid) {
      setIsShowBottomsheet(true);
    } else {
      onCloseBottomSheet();
      navigation.goBack();
    }
  };
  const onPressRole = (idx: number) => {
    setValue('role', ROLES[idx], { shouldValidate: true });
    setIndex(idx);
  };

  const service = useRealmService();

  const handleDeleteUser = async (_user: AddUserProps['user']) => {
    if (!_user) return;

    await service.deleteUser(_user.id);
    onClose();
  };

  const onDelete = () => {
    setIsDeleteClicked(true);
    handleBottomSheetState(true);
  };

  const onSave = async (data: AddUserForm) => {
    const newUser: ZellerCustomer = {
      id: isEditMode ? user?.id || user?._id || '' : getRandomUuid(),
      name: `${data.firstName} ${data.lastName}`.trim(),
      firstName: data.firstName,
      lastName: data.lastName,
      email: data.email,
      role: ROLES[index.value],
    };

    if (isEditMode) {
      await service.updateUser(newUser);
    } else {
      await service.createUser(newUser);
    }
    onClose();
  };

  useEffect(() => {
    if (isEditMode) {
      trigger();
    }
  }, [isEditMode, trigger]);

  return (
    <SafeAreaView
      testID="add-user-screen"
      style={styles.safeAreaContainer}
      edges={['top', 'bottom']}
    >
      <View testID="add-user-container" style={styles.container}>
        <TouchableOpacity
          testID="add-user-close-button"
          style={styles.closeIcon}
          onPress={onClose}
        >
          <CloseIcon />
        </TouchableOpacity>

        <View>
          <Text testID="add-user-title" style={styles.newUser}>
            {t.labels['new-user-cap']}
          </Text>
        </View>
        <View testID="add-user-content" style={styles.content}>
          <Controller
            control={control}
            name="firstName"
            render={({ field }) => (
              <>
                <TextInput
                  testID="add-user-first-name-input"
                  placeholder={t.labels['first-name']}
                  style={styles.input}
                  onChangeText={field.onChange}
                  value={field.value}
                />
                {errors.firstName && (
                  <Text style={styles.error}>{errors.firstName.message}</Text>
                )}
              </>
            )}
          />

          <Controller
            control={control}
            name="lastName"
            render={({ field }) => (
              <>
                <TextInput
                  testID="add-user-last-name-input"
                  placeholder={t.labels['last-name']}
                  style={styles.input}
                  onChangeText={field.onChange}
                  value={field.value}
                />
                {errors.lastName && (
                  <Text style={styles.error}>{errors.lastName.message}</Text>
                )}
              </>
            )}
          />

          <Controller
            control={control}
            name="email"
            render={({ field }) => (
              <>
                <TextInput
                  testID="add-user-email-input"
                  placeholder={t.labels.email}
                  style={styles.input}
                  autoCapitalize="none"
                  keyboardType="email-address"
                  onChangeText={field.onChange}
                  value={field.value}
                />
                {errors.email && (
                  <Text style={styles.error}>{errors.email.message}</Text>
                )}
              </>
            )}
          />

          <Text testID="add-user-role-label" style={styles.label}>
            {t.labels['user-role-cap']}
          </Text>
          <TabBar animatedIndex={index} tabs={ROLES} onPress={onPressRole} />
        </View>

        {isEditMode && (
          <TouchableOpacity
            testID="add-user-delete-button"
            onPress={onDelete}
            style={styles.deleteButton}
          >
            <Text style={styles.deleteText}>{t.labels['delete-user']}</Text>
          </TouchableOpacity>
        )}

        <AppButton
          testID="add-user-save-button"
          disabled={!isValid}
          title={isEditMode ? t.labels['update-user'] : t.labels['create-user']}
          onPress={handleSubmit(onSave)}
        />

        <AppBottomSheet
          visible={isShowBottomsheet}
          onClose={onCloseBottomSheet}
          children={
            <BottomSheetContent
              title={
                isValid && isDeleteClicked
                  ? t.messages['delete-user-prompt']
                  : t.messages['please-clear-form-errors']
              }
              secondaryButtonProps={
                !isValid && !isDeleteClicked
                  ? undefined
                  : {
                      title: t.labels.delete,
                      variant: 'label',
                      textStyle: { color: colors.error },
                      onPress: () => handleDeleteUser(user),
                    }
              }
              primaryButtonProps={
                !isValid && !isDeleteClicked
                  ? undefined
                  : {
                      title: t.labels.cancel,
                      onPress: onCloseBottomSheet,
                    }
              }
            />
          }
        />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeAreaContainer: { flex: 1 },
  container: {
    flex: 1,
    paddingHorizontal: 14,
  },
  contentContainer: {
    gap: 40,
    justifyContent: 'center',
  },
  closeIcon: { marginLeft: 6, marginBottom: 30 },
  newUser: { fontWeight: '600', fontSize: 16 },
  modalText: { fontWeight: '600' },
  title: {
    flex: 1,
    textAlign: 'center',
    fontSize: 17,
    fontWeight: '600',
  },

  content: {
    flex: 1,
    paddingVertical: 20,
  },

  label: {
    fontSize: 13,
    color: colors.gray,
    marginBottom: 6,
    marginTop: 24,
  },

  input: {
    borderBottomWidth: 1,
    borderColor: colors.inputBorder,
    borderRadius: 10,
    padding: 20,
    fontSize: 15,
  },

  roleRow: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 8,
  },

  rolePill: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: colors.primary,
    backgroundColor: colors.tabBackground,
  },

  roleText: {
    color: colors.primary,
    fontWeight: '600',
  },

  footer: {
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: colors.inputBorder,
  },

  saveButton: {
    backgroundColor: colors.primary,
    paddingVertical: 14,
    borderRadius: 40,
    alignItems: 'center',
  },

  saveText: {
    color: colors.cardBackground,
    fontSize: 16,
    fontWeight: '600',
  },

  error: {
    color: colors.error,
    fontSize: 12,
    paddingLeft: 10,
    paddingVertical: 4,
  },

  deleteButton: {
    marginBottom: 12,
    paddingVertical: 14,
    borderRadius: 40,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.error,
  },

  deleteText: {
    color: colors.error,
    fontSize: 16,
    fontWeight: '600',
  },

  saveButtonDisabled: {
    opacity: 0.5,
  },

  buttonContainer: {
    paddingHorizontal: 10,
  },
});

export default AddUser;
