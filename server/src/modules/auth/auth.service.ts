import crypto from 'crypto'
import { prisma } from '../../config/database'
import { hashPassword, comparePassword } from '../../utils/password'
import { generateAccessToken, generateRefreshToken, verifyRefreshToken } from '../../utils/jwt'
import { sendVerificationEmail, sendPasswordResetEmail } from '../../config/email'
import {
  RegisterDto,
  LoginDto,
  ForgotPasswordDto,
  ResetPasswordDto,
  ChangePasswordDto,
  UpdateProfileDto,
} from './auth.schema'

export class AuthService {
  // ─── REGISTER ──────────────────────────────────────────────────────────────
  async register(dto: RegisterDto) {
    const existing = await prisma.user.findUnique({ where: { email: dto.email } })
    if (existing) {
      throw new Error('Bu email allaqachon ro\'yxatdan o\'tgan')
    }

    const passwordHash = await hashPassword(dto.password)
    const verifyToken = crypto.randomBytes(32).toString('hex')

    const user = await prisma.user.create({
      data: {
        email: dto.email,
        passwordHash,
        fullName: dto.fullName,
        track: dto.track,
        verifyToken,
      },
      select: {
        id: true,
        email: true,
        fullName: true,
        role: true,
        track: true,
        isVerified: true,
        createdAt: true,
      },
    })

    await sendVerificationEmail(dto.email, verifyToken)

    return { user, message: 'Ro\'yxatdan o\'tdingiz! Email manzilingizni tasdiqlang.' }
  }

  // ─── LOGIN ─────────────────────────────────────────────────────────────────
  async login(dto: LoginDto) {
    const user = await prisma.user.findUnique({ where: { email: dto.email } })
    if (!user) {
      throw new Error('Email yoki parol noto\'g\'ri')
    }

    const isPasswordValid = await comparePassword(dto.password, user.passwordHash)
    if (!isPasswordValid) {
      throw new Error('Email yoki parol noto\'g\'ri')
    }

    if (!user.isVerified) {
      throw new Error('Email manzilingiz tasdiqlanmagan. Emailingizni tekshiring.')
    }

    const payload = { userId: user.id, email: user.email, role: user.role }
    const accessToken = generateAccessToken(payload)
    const refreshToken = generateRefreshToken(payload)

    // Update streak
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    const lastActive = user.lastActive ? new Date(user.lastActive) : null
    let streakCount = user.streakCount

    if (lastActive) {
      const lastActiveDay = new Date(lastActive)
      lastActiveDay.setHours(0, 0, 0, 0)
      const diffDays = Math.floor((today.getTime() - lastActiveDay.getTime()) / (1000 * 60 * 60 * 24))
      if (diffDays === 1) {
        streakCount += 1
      } else if (diffDays > 1) {
        streakCount = 1
      }
    } else {
      streakCount = 1
    }

    await prisma.user.update({
      where: { id: user.id },
      data: { refreshToken, lastActive: new Date(), streakCount },
    })

    const { passwordHash, verifyToken, resetToken, resetTokenExp, refreshToken: _rt, ...safeUser } = user

    return { accessToken, refreshToken, user: { ...safeUser, streakCount } }
  }

  // ─── LOGOUT ────────────────────────────────────────────────────────────────
  async logout(userId: string) {
    await prisma.user.update({
      where: { id: userId },
      data: { refreshToken: null },
    })
  }

  // ─── REFRESH TOKEN ─────────────────────────────────────────────────────────
  async refreshTokens(token: string) {
    let payload: { userId: string; email: string; role: string }
    try {
      payload = verifyRefreshToken(token)
    } catch {
      throw new Error('Refresh token noto\'g\'ri yoki muddati o\'tgan')
    }

    const user = await prisma.user.findFirst({
      where: { id: payload.userId, refreshToken: token },
    })
    if (!user) {
      throw new Error('Refresh token topilmadi')
    }

    const newPayload = { userId: user.id, email: user.email, role: user.role }
    const accessToken = generateAccessToken(newPayload)
    const refreshToken = generateRefreshToken(newPayload)

    await prisma.user.update({
      where: { id: user.id },
      data: { refreshToken },
    })

    return { accessToken, refreshToken }
  }

  // ─── VERIFY EMAIL ──────────────────────────────────────────────────────────
  async verifyEmail(token: string) {
    const user = await prisma.user.findFirst({ where: { verifyToken: token } })
    if (!user) {
      throw new Error('Noto\'g\'ri yoki muddati o\'tgan token')
    }

    await prisma.user.update({
      where: { id: user.id },
      data: { isVerified: true, verifyToken: null },
    })

    // Give "first login" achievement
    await this.checkAndGrantAchievement(user.id, 'QUIZ_COUNT', 0)
  }

  // ─── FORGOT PASSWORD ───────────────────────────────────────────────────────
  async forgotPassword(dto: ForgotPasswordDto) {
    const user = await prisma.user.findUnique({ where: { email: dto.email } })
    // Always return success (security)
    if (!user) return

    const resetToken = crypto.randomBytes(32).toString('hex')
    const resetTokenExp = new Date(Date.now() + 60 * 60 * 1000) // 1 hour

    await prisma.user.update({
      where: { id: user.id },
      data: { resetToken, resetTokenExp },
    })

    await sendPasswordResetEmail(dto.email, resetToken)
  }

  // ─── RESET PASSWORD ────────────────────────────────────────────────────────
  async resetPassword(dto: ResetPasswordDto) {
    const user = await prisma.user.findFirst({
      where: {
        resetToken: dto.token,
        resetTokenExp: { gt: new Date() },
      },
    })
    if (!user) {
      throw new Error('Token noto\'g\'ri yoki muddati o\'tgan')
    }

    const passwordHash = await hashPassword(dto.password)

    await prisma.user.update({
      where: { id: user.id },
      data: { passwordHash, resetToken: null, resetTokenExp: null },
    })
  }

  // ─── GET PROFILE ───────────────────────────────────────────────────────────
  async getProfile(userId: string) {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        email: true,
        fullName: true,
        avatarUrl: true,
        role: true,
        track: true,
        isVerified: true,
        streakCount: true,
        lastActive: true,
        createdAt: true,
        _count: {
          select: {
            quizResults: true,
            bookmarks: true,
            aiSessions: true,
          },
        },
      },
    })
    if (!user) throw new Error('Foydalanuvchi topilmadi')
    return user
  }

  // ─── UPDATE PROFILE ────────────────────────────────────────────────────────
  async updateProfile(userId: string, dto: UpdateProfileDto) {
    const user = await prisma.user.update({
      where: { id: userId },
      data: dto,
      select: {
        id: true,
        email: true,
        fullName: true,
        avatarUrl: true,
        role: true,
        track: true,
        isVerified: true,
        streakCount: true,
        updatedAt: true,
      },
    })
    return user
  }

  // ─── CHANGE PASSWORD ───────────────────────────────────────────────────────
  async changePassword(userId: string, dto: ChangePasswordDto) {
    const user = await prisma.user.findUnique({ where: { id: userId } })
    if (!user) throw new Error('Foydalanuvchi topilmadi')

    const isValid = await comparePassword(dto.currentPassword, user.passwordHash)
    if (!isValid) throw new Error('Joriy parol noto\'g\'ri')

    const passwordHash = await hashPassword(dto.newPassword)
    await prisma.user.update({ where: { id: userId }, data: { passwordHash } })
  }

  // ─── HELPER: Check achievements ────────────────────────────────────────────
  private async checkAndGrantAchievement(userId: string, conditionType: string, value: number) {
    try {
      const achievements = await prisma.achievement.findMany({
        where: { conditionType: conditionType as any },
      })
      for (const ach of achievements) {
        if (ach.conditionValue <= value) {
          await prisma.userAchievement.upsert({
            where: { userId_achievementId: { userId, achievementId: ach.id } },
            update: {},
            create: { userId, achievementId: ach.id },
          })
        }
      }
    } catch {
      // Non-critical, ignore
    }
  }
}

export const authService = new AuthService()
