import { zodResolver } from '@hookform/resolvers/zod';
import { useNavigation } from '@react-navigation/native';
import React from 'react';
import { Controller, useForm } from 'react-hook-form';
import {
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTabIndex } from '../hooks/use-tab-index.hook';
import { colors } from '../utils/color.util';
import { ROLES } from '../utils/common';
import { AddUserForm, addUserSchema } from '../validation/user-form.schema';
import CloseIcon from './icons/close.icon';
import { TabBar } from './tab-bar.component';
import { createUserLocal } from '../services/local/realm/user.logic';

export const AddUser = () => {
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
      roleIndex: 0,
    },
  });

  const onClose = () => {
    navigation.pop();
  };
  const onPressRole = (idx: number) => {
    setIndex(idx);
  };

  const onSave = (data: AddUserForm) => {
    data.roleIndex = index.value;
    console.log("Data", data);
    const user: ZellerCustomer = {
      id: '4',
      name: `${data.firstName} ${data.lastName}`.trim(),
      email: data.email,
      role: ROLES[index.value],
    };

    createUserLocal(user);
    navigation.pop();
  };

  return (
    <SafeAreaView style={{ flex: 1 }} edges={['top', 'bottom']}>
      <View style={styles.container}>
        <TouchableOpacity
          style={{ marginLeft: 6, marginBottom: 30 }}
          onPress={onClose}
        >
          <CloseIcon />
        </TouchableOpacity>

        <View>
          <Text style={{ fontWeight: '600', fontSize: 16 }}>New User</Text>
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
          <TabBar animatedIndex={index} tabs={ROLES} onPress={onPressRole} />
        </View>

        <TouchableOpacity
          onPress={handleSubmit(onSave)}
          style={[styles.saveButton, !isValid && styles.saveButtonDisabled]}
          disabled={!isValid}
        >
          <Text style={styles.saveText}>Create user</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    paddingHorizontal: 14,
  },

  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E5EA',
  },

  close: {
    color: colors.primary,
    fontSize: 16,
    width: 60,
  },

  title: {
    flex: 1,
    textAlign: 'center',
    fontSize: 17,
    fontWeight: '600',
  },

  content: {
    flex: 1,
    paddingVertical: 16,
  },

  label: {
    fontSize: 13,
    color: colors.gray,
    marginBottom: 6,
    marginTop: 16,
  },

  input: {
    borderBottomWidth: 1,
    borderColor: '#E5E5EA',
    borderRadius: 10,
    padding: 12,
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
    borderTopColor: '#E5E5EA',
  },

  saveButton: {
    backgroundColor: colors.primary,
    paddingVertical: 14,
    borderRadius: 40,
    alignItems: 'center',
  },

  saveText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },

  error: {
    color: colors.error,
    fontSize: 12,
    paddingLeft: 10,
    paddingVertical: 4,
  },

  saveButtonDisabled: {
    opacity: 0.5,
  },
});

export default AddUser;
