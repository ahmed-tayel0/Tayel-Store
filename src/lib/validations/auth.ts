import { z } from 'zod';

export const loginSchema = z.object({
  email: z.string().email({ message: 'auth.invalidEmail' }),
  password: z.string().min(6, { message: 'auth.weakPassword' }),
  rememberMe: z.boolean().optional(),
});

export type LoginFormValues = z.infer<typeof loginSchema>;

const egyptianPhoneRegex = /^01[0125][0-9]{8}$/;

export const registerSchema = z
  .object({
    name: z.string().min(3, { message: 'auth.nameMinLength' }),
    email: z.string().email({ message: 'auth.invalidEmail' }),
    phone: z.string().regex(egyptianPhoneRegex, { message: 'auth.invalidPhone' }).optional().or(z.literal('')),
    password: z.string().min(6, { message: 'auth.weakPassword' }),
    rePassword: z.string(),
  })
  .refine((data) => data.password === data.rePassword, {
    message: 'auth.passwordsDontMatch',
    path: ['rePassword'],
  });

export type RegisterFormValues = z.infer<typeof registerSchema>;

// Forgot Password Schemas
export const forgotPasswordSchema = z.object({
  email: z.string().email({ message: 'auth.invalidEmail' }),
});

export type ForgotPasswordFormValues = z.infer<typeof forgotPasswordSchema>;

export const verifyCodeSchema = z.object({
  resetCode: z.string().length(6, { message: 'auth.invalidCodeLength' }),
});

export type VerifyCodeFormValues = z.infer<typeof verifyCodeSchema>;

export const resetPasswordSchema = z
  .object({
    email: z.string().email({ message: 'auth.invalidEmail' }),
    newPassword: z.string().min(6, { message: 'auth.weakPassword' }),
    confirmPassword: z.string(),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: 'auth.passwordsDontMatch',
    path: ['confirmPassword'],
  });

export type ResetPasswordFormValues = z.infer<typeof resetPasswordSchema>;