import * as z from 'zod';

export const userSchema = z.object({
  name: z
    .string()
    .min(1, {error: 'Name is required'})
    .max(100, {error: 'Name must not be more than 100 characters'}),

  email: z.email({error: 'Invalid email address'})
});

export type UserDto = z.infer<typeof userSchema>;