import * as z from 'zod';

export const registerSchema = z.object({
  name: z
    .string()
    .min(1, {message: 'Name is required'})
    .max(100, {message: 'Name must not exceed 100 characters'}),
  email: z.email({message: 'Invalid email address'}),
  password: z
    .string()
    .min(8, {message: 'Password must be at least 8 characters'}),
});

export const loginSchema = z.object({
  email: z.email({message: 'Invalid email address'}),
  password: z.string().min(1, {message: 'Password is required'}),
});

export const refreshTokenSchema = z.object({
  refreshToken: z.string().min(1, {message: 'Refresh token is required'}),
});

export const requestPasswordResetSchema = z.object({
  email: z.email({message: 'Invalid email address'}),
});

export const resetPasswordSchema = z.object({
  token: z.string().min(1, {message: 'Token is required'}),
  password: z.string().min(8, {message: 'Password must be at least 8 characters'}),
});

export type RegisterDTO = z.infer<typeof registerSchema>;
export type LoginDTO = z.infer<typeof loginSchema>;
export type RefreshDTO = z.infer<typeof refreshTokenSchema>;
export type RequestPasswordResetDTO = z.infer<typeof requestPasswordResetSchema>;
export type ResetPasswordDTO = z.infer<typeof resetPasswordSchema>;