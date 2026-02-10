import { zodResolver } from '@hookform/resolvers/zod';
import { useNavigation } from '@react-navigation/native';
import React, { FC } from 'react';
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
import { useTabIndex } from '../../../shared/hooks/use-tab-index.hook';
import { ZellerCustomer } from '../../../shared/services/graphql/types';
import { colors } from '../../../shared/utils/color.util';
import { getRandomUuid, ROLES } from '../../../shared/utils/common';
import { AddUserForm, addUserSchema } from '../validation/user-form.schema';
import CloseIcon from '../../../shared/components/icons/close.icon';
import { TabBar } from '../../../shared/components/tab-bar.component';
import { SharedValue } from 'react-native-reanimated';
import { UserRole } from '../../../shared/models/user.models';

interface AddUserProps {
  isEditMode: boolean;
  user?: ZellerCustomer;
}

export const AddUser: FC<AddUserProps> = ({ isEditMode, user }) => {
  const [index, setIndex] = useTabIndex(0);
  const navigation = useNavigation();

  const {
    control,
    handleSubmit,
    formState: { errors, isValid },
  } = useForm<AddUserForm>({
    resolver: zodResolver(addUserSchema),
    mode: 'onChange',
    defaultValues: {
      firstName: user?.name?.split(' ')[0] || '',
      lastName: user?.name?.split(' ').slice(1).join(' ') || '',
      email: user?.email || '',
      roleIndex: user ? ROLES.indexOf(String(user.role)) : 0,
    },
  });

  const onClose = () => {
    //@ts-ignore
    navigation.pop();
  };
  const onPressRole = (idx: SharedValue<number>) => {
    //@ts-ignore
    setIndex(idx);
  };

  const service = useRealmService();

  const onDelete = async () => {
    if (!user) return;

    await service.deleteUser(user.id);
    onClose();
  };

  const onSave = async (data: AddUserForm) => {
    data.roleIndex = (index as SharedValue<number>).value;
    const newUser: ZellerCustomer = {
      id: isEditMode ? user?.id || user?._id || '' : getRandomUuid(),
      name: `${data.firstName} ${data.lastName}`.trim(),
      firstName: data.firstName,
      lastName: data.lastName,
      email: data.email,
      role: ROLES[(index as SharedValue<number>).value] as UserRole,
    };

    if (isEditMode) {
      await service.updateUser(newUser);
    } else {
      await service.createUser(newUser);
    }

    onClose();
  };

  React.useEffect(() => {
    if (user) {
      //@ts-ignore
      setIndex(ROLES.indexOf(user.role) as unknown as SharedValue<number>);
    }
  }, [setIndex, user]);

  return (
    <SafeAreaView style={styles.safeAreaContainer} edges={['top', 'bottom']}>
      <View style={styles.container}>
        <TouchableOpacity style={styles.closeIcon} onPress={onClose}>
          <CloseIcon />
        </TouchableOpacity>

        <View>
          <Text style={styles.newUser}>New User</Text>
        </View>
        <View style={styles.content}>
          <Controller
            control={control}
            name="firstName"
            render={({ field }) => (
              <>
                <TextInput
                  placeholder="First name"
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
                  placeholder="Last name"
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
                  placeholder="Email"
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

          <Text style={styles.label}>User Role</Text>
          <TabBar
            animatedIndex={index as SharedValue<number>}
            tabs={ROLES}
            onPress={onPressRole}
          />
        </View>

        {isEditMode && (
          <TouchableOpacity onPress={onDelete} style={styles.deleteButton}>
            <Text style={styles.deleteText}>Delete user</Text>
          </TouchableOpacity>
        )}

        <TouchableOpacity
          onPress={handleSubmit(onSave)}
          style={[styles.saveButton, !isValid && styles.saveButtonDisabled]}
          disabled={!isValid}
        >
          <Text style={styles.saveText}>
            {isEditMode ? 'Update' : 'Create'} user
          </Text>
        </TouchableOpacity>
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

  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: colors.inputBorder,
  },

  close: {
    color: colors.primary,
    fontSize: 16,
    width: 60,
  },

  closeIcon: { marginLeft: 6, marginBottom: 30 },

  newUser: { fontWeight: '600', fontSize: 16 },
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
});

export default AddUser;
