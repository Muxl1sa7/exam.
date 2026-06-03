import { Request, Response } from 'express'
import { authService } from './auth.service'
import { successResponse, errorResponse } from '../../utils/response'
import { AuthRequest } from '../../types'

export class AuthController {
  async register(req: Request, res: Response): Promise<void> {
    try {
      const result = await authService.register(req.body)
      successResponse(res, result, 'Muvaffaqiyatli ro\'yxatdan o\'tdingiz', 201)
    } catch (err: any) {
      errorResponse(res, err.message, err.message.includes('allaqachon') ? 409 : 400)
    }
  }

  async login(req: Request, res: Response): Promise<void> {
    try {
      const result = await authService.login(req.body)

      // Set refresh token as httpOnly cookie
      res.cookie('refreshToken', result.refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
      })

      successResponse(res, { accessToken: result.accessToken, user: result.user }, 'Muvaffaqiyatli kirdingiz')
    } catch (err: any) {
      errorResponse(res, err.message, 401)
    }
  }

  async logout(req: AuthRequest, res: Response): Promise<void> {
    try {
      await authService.logout(req.user!.userId)
      res.clearCookie('refreshToken')
      successResponse(res, null, 'Muvaffaqiyatli chiqdingiz')
    } catch (err: any) {
      errorResponse(res, err.message)
    }
  }

  async refresh(req: Request, res: Response): Promise<void> {
    try {
      const token = req.cookies?.refreshToken || req.body?.refreshToken
      if (!token) {
        errorResponse(res, 'Refresh token topilmadi', 401)
        return
      }

      const result = await authService.refreshTokens(token)

      res.cookie('refreshToken', result.refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 7 * 24 * 60 * 60 * 1000,
      })

      successResponse(res, { accessToken: result.accessToken }, 'Token yangilandi')
    } catch (err: any) {
      errorResponse(res, err.message, 401)
    }
  }

  async verifyEmail(req: Request, res: Response): Promise<void> {
    try {
      const { token } = req.query as { token: string }
      if (!token) {
        errorResponse(res, 'Token talab qilinadi', 400)
        return
      }
      await authService.verifyEmail(token)
      successResponse(res, null, 'Email muvaffaqiyatli tasdiqlandi')
    } catch (err: any) {
      errorResponse(res, err.message, 400)
    }
  }

  async forgotPassword(req: Request, res: Response): Promise<void> {
    try {
      await authService.forgotPassword(req.body)
      successResponse(res, null, 'Parolni tiklash havolasi emailingizga yuborildi')
    } catch (err: any) {
      errorResponse(res, err.message)
    }
  }

  async resetPassword(req: Request, res: Response): Promise<void> {
    try {
      await authService.resetPassword(req.body)
      successResponse(res, null, 'Parol muvaffaqiyatli yangilandi')
    } catch (err: any) {
      errorResponse(res, err.message, 400)
    }
  }

  async getProfile(req: AuthRequest, res: Response): Promise<void> {
    try {
      const user = await authService.getProfile(req.user!.userId)
      successResponse(res, user)
    } catch (err: any) {
      errorResponse(res, err.message)
    }
  }

  async updateProfile(req: AuthRequest, res: Response): Promise<void> {
    try {
      const user = await authService.updateProfile(req.user!.userId, req.body)
      successResponse(res, user, 'Profil yangilandi')
    } catch (err: any) {
      errorResponse(res, err.message)
    }
  }

  async changePassword(req: AuthRequest, res: Response): Promise<void> {
    try {
      await authService.changePassword(req.user!.userId, req.body)
      successResponse(res, null, 'Parol muvaffaqiyatli o\'zgartirildi')
    } catch (err: any) {
      errorResponse(res, err.message, 400)
    }
  }
}

export const authController = new AuthController()
