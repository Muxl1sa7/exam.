import api from './axios'
import type { User } from '../types'

export const authApi = {
  register: (data: { email: string; password: string; fullName: string; track?: string }) =>
    api.post('/auth/register', data),
  login: (data: { email: string; password: string }) =>
    api.post<{ data: { accessToken: string; user: User } }>('/auth/login', data),
  logout: () => api.post('/auth/logout'),
  verifyEmail: (token: string) => api.get(`/auth/verify-email?token=${token}`),
  forgotPassword: (email: string) => api.post('/auth/forgot-password', { email }),
  resetPassword: (token: string, password: string) =>
    api.post('/auth/reset-password', { token, password }),
  getProfile: () => api.get<{ data: User }>('/auth/me'),
  updateProfile: (data: Partial<User>) => api.put<{ data: User }>('/auth/profile', data),
  changePassword: (currentPassword: string, newPassword: string) =>
    api.put('/auth/change-password', { currentPassword, newPassword }),
}
