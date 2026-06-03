import { z } from 'zod'

export const registerSchema = z.object({
  email: z.string().email('Email noto\'g\'ri formatda'),
  password: z
    .string()
    .min(8, 'Parol kamida 8 ta belgidan iborat bo\'lishi kerak')
    .regex(/[A-Z]/, 'Parolda kamida 1 ta katta harf bo\'lishi kerak')
    .regex(/[0-9]/, 'Parolda kamida 1 ta raqam bo\'lishi kerak'),
  fullName: z
    .string()
    .min(2, 'Ism kamida 2 ta belgidan iborat bo\'lishi kerak')
    .max(100, 'Ism 100 ta belgidan oshmasligi kerak'),
  track: z.enum(['FRONTEND', 'BACKEND', 'FULLSTACK']).optional(),
})

export const loginSchema = z.object({
  email: z.string().email('Email noto\'g\'ri formatda'),
  password: z.string().min(1, 'Parol kiritilishi shart'),
})

export const forgotPasswordSchema = z.object({
  email: z.string().email('Email noto\'g\'ri formatda'),
})

export const resetPasswordSchema = z.object({
  token: z.string().min(1, 'Token talab qilinadi'),
  password: z
    .string()
    .min(8, 'Parol kamida 8 ta belgidan iborat bo\'lishi kerak')
    .regex(/[A-Z]/, 'Parolda kamida 1 ta katta harf bo\'lishi kerak')
    .regex(/[0-9]/, 'Parolda kamida 1 ta raqam bo\'lishi kerak'),
})

export const changePasswordSchema = z.object({
  currentPassword: z.string().min(1, 'Joriy parol kiritilishi shart'),
  newPassword: z
    .string()
    .min(8, 'Yangi parol kamida 8 ta belgidan iborat bo\'lishi kerak')
    .regex(/[A-Z]/, 'Parolda kamida 1 ta katta harf bo\'lishi kerak')
    .regex(/[0-9]/, 'Parolda kamida 1 ta raqam bo\'lishi kerak'),
})

export const updateProfileSchema = z.object({
  fullName: z.string().min(2).max(100).optional(),
  avatarUrl: z.string().url().optional(),
  track: z.enum(['FRONTEND', 'BACKEND', 'FULLSTACK']).optional(),
})

export type RegisterDto = z.infer<typeof registerSchema>
export type LoginDto = z.infer<typeof loginSchema>
export type ForgotPasswordDto = z.infer<typeof forgotPasswordSchema>
export type ResetPasswordDto = z.infer<typeof resetPasswordSchema>
export type ChangePasswordDto = z.infer<typeof changePasswordSchema>
export type UpdateProfileDto = z.infer<typeof updateProfileSchema>
