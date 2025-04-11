import { z } from 'zod';
import { ColorVisionType } from '../types/user';

// Common password validation
const passwordValidation = z
  .string()
  .min(8, '비밀번호는 최소 8자 이상이어야 합니다.')
  .regex(/[A-Z]/, '대문자를 포함해야 합니다.')
  .regex(/[a-z]/, '소문자를 포함해야 합니다.')
  .regex(/[0-9]/, '숫자를 포함해야 합니다.')
  .regex(/[^A-Za-z0-9]/, '특수문자를 포함해야 합니다.');

// Register schema
export const registerSchema = z.object({
  email: z.string()
    .min(1, '이메일을 입력해주세요.')
    .email('올바른 이메일 형식이 아닙니다.'),
  password: z.string()
    .min(8, '비밀번호는 최소 8자 이상이어야 합니다.')
    .regex(/[A-Z]/, '대문자를 포함해야 합니다.')
    .regex(/[a-z]/, '소문자를 포함해야 합니다.')
    .regex(/[0-9]/, '숫자를 포함해야 합니다.')
    .regex(/[^A-Za-z0-9]/, '특수문자를 포함해야 합니다.'),
  confirmPassword: z.string()
    .min(1, '비밀번호를 한번 더 입력해주세요.'),
  nickname: z.string()
    .min(2, '닉네임은 최소 2자 이상이어야 합니다.')
    .max(20, '닉네임은 최대 20자까지 가능합니다.'),
  colorVisionType: z.enum(['normal', 'protanopia', 'deuteranopia', 'tritanopia', 'monochromacy']),
  bio: z.string().optional(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "비밀번호가 일치하지 않습니다.",
  path: ["confirmPassword"],
});

// Login schema
export const loginSchema = z.object({
  email: z.string().email('유효한 이메일 주소를 입력해주세요.'),
  password: z.string().min(1, '비밀번호를 입력해주세요.'),
});

// Reset password request schema
export const resetPasswordRequestSchema = z.object({
  email: z.string().email('유효한 이메일 주소를 입력해주세요.'),
});

// Reset password schema
export const resetPasswordSchema = z.object({
  password: passwordValidation,
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: '비밀번호가 일치하지 않습니다.',
  path: ['confirmPassword'],
});

// Profile update schema
export const profileUpdateSchema = z.object({
  nickname: z.string().min(2).max(30).optional(),
  bio: z.string().max(200).optional(),
  colorVisionType: z.enum(['normal', 'protanopia', 'deuteranopia', 'tritanopia', 'monochromacy'] as const).optional(),
  preferences: z.object({
    styles: z.array(z.string()).optional(),
    interests: z.array(z.string()).optional(),
    colorSchemes: z.array(z.string()).optional(),
  }).optional(),
  email: z
    .string()
    .email('유효한 이메일 주소를 입력해주세요.')
    .optional(),
  currentPassword: z.string().optional(),
  newPassword: passwordValidation.optional(),
  confirmNewPassword: z.string().optional()
}).refine((data) => {
  if (data.newPassword && !data.currentPassword) {
    return false;
  }
  return true;
}, {
  message: '현재 비밀번호를 입력해주세요.',
  path: ['currentPassword'],
}).refine((data) => {
  if (data.newPassword && data.newPassword !== data.confirmNewPassword) {
    return false;
  }
  return true;
}, {
  message: '새 비밀번호가 일치하지 않습니다.',
  path: ['confirmNewPassword'],
});

export type RegisterFormData = z.infer<typeof registerSchema>;
export type LoginFormData = z.infer<typeof loginSchema>;
export type ResetPasswordRequestFormData = z.infer<typeof resetPasswordRequestSchema>;
export type ResetPasswordFormData = z.infer<typeof resetPasswordSchema>;
export type ProfileUpdateFormData = z.infer<typeof profileUpdateSchema>; 