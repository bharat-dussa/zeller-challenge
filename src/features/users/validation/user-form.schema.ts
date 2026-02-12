import { z } from 'zod';

export const addUserSchema = z.object({
  // as per mention in README.md validation (only alpgabet and spaces are allowed) is there but from api number is coming so you will get a modal for this to change the details of users. 

  firstName: z
    .string()
    .trim()  
    .min(1, 'First name is required')
    .max(50, 'Max 50 characters')
    .regex(/^[A-Za-z ]+$/, 'Only alphabets allowed'),

  lastName: z
    .string()
    .trim()
    .max(50, 'Max 50 characters')
    .regex(/^[A-Za-z ]+$/, 'Only alphabets allowed')
    .optional()
    .or(z.literal('')),
    
  email: z.string().email('Invalid email address'),

  role: z.string(),
});

export type AddUserForm = z.infer<typeof addUserSchema>;
