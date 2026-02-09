import { z } from 'zod';

export const addUserSchema = z.object({
  firstName: z
    .string()
    .min(1, 'First name is required')
    .max(50, 'Max 50 characters')
    .regex(/^[A-Za-z ]+$/, 'Only alphabets allowed'),

  lastName: z
    .string()
    .min(1, 'Last name is required')
    .max(50, 'Max 50 characters')
    .regex(/^[A-Za-z ]+$/, 'Only alphabets allowed'),

  email: z
    .string()
    .email('Invalid email address'),

  roleIndex: z.number(),
});

export type AddUserForm = z.infer<typeof addUserSchema>;
