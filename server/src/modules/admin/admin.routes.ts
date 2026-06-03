import { Router, Response } from 'express'
import { prisma } from '../../config/database'
import { authMiddleware } from '../../middleware/auth.middleware'
import { adminMiddleware } from '../../middleware/admin.middleware'
import { successResponse, errorResponse, paginatedResponse } from '../../utils/response'
import { AuthRequest } from '../../types'

const router = Router()
router.use(authMiddleware, adminMiddleware)

// ─── USERS ───────────────────────────────────────────────────────────────────
router.get('/users', async (req: AuthRequest, res: Response) => {
  try {
    const page = parseInt(req.query.page as string) || 1
    const limit = parseInt(req.query.limit as string) || 20
    const skip = (page - 1) * limit
    const search = req.query.search as string

    const where: any = {}
    if (search) {
      where.OR = [
        { email: { contains: search, mode: 'insensitive' } },
        { fullName: { contains: search, mode: 'insensitive' } },
      ]
    }

    const [users, total] = await Promise.all([
      prisma.user.findMany({
        where,
        skip,
        take: limit,
        select: {
          id: true, email: true, fullName: true, role: true, track: true,
          isVerified: true, streakCount: true, createdAt: true,
          _count: { select: { quizResults: true, aiSessions: true } },
        },
        orderBy: { createdAt: 'desc' },
      }),
      prisma.user.count({ where }),
    ])
    paginatedResponse(res, users, { page, limit, total })
  } catch (err: any) {
    errorResponse(res, err.message)
  }
})

router.delete('/users/:id', async (req: AuthRequest, res: Response) => {
  try {
    if (req.params.id === req.user!.userId) {
      errorResponse(res, 'O\'zingizni o\'chira olmaysiz', 400)
      return
    }
    await prisma.user.delete({ where: { id: req.params.id } })
    successResponse(res, null, 'Foydalanuvchi o\'chirildi')
  } catch (err: any) {
    errorResponse(res, err.message)
  }
})

// ─── QUESTIONS ───────────────────────────────────────────────────────────────
router.post('/questions', async (req: AuthRequest, res: Response) => {
  try {
    const question = await prisma.question.create({
      data: { ...req.body, createdById: req.user!.userId },
      include: { category: true },
    })
    await prisma.adminLog.create({
      data: { adminId: req.user!.userId, action: 'CREATE_QUESTION', target: question.id },
    })
    successResponse(res, question, 'Savol yaratildi', 201)
  } catch (err: any) {
    errorResponse(res, err.message)
  }
})

router.put('/questions/:id', async (req: AuthRequest, res: Response) => {
  try {
    const question = await prisma.question.update({
      where: { id: req.params.id },
      data: req.body,
      include: { category: true },
    })
    await prisma.adminLog.create({
      data: { adminId: req.user!.userId, action: 'UPDATE_QUESTION', target: question.id },
    })
    successResponse(res, question, 'Savol yangilandi')
  } catch (err: any) {
    errorResponse(res, err.message)
  }
})

router.delete('/questions/:id', async (req: AuthRequest, res: Response) => {
  try {
    await prisma.question.delete({ where: { id: req.params.id } })
    await prisma.adminLog.create({
      data: { adminId: req.user!.userId, action: 'DELETE_QUESTION', target: req.params.id },
    })
    successResponse(res, null, 'Savol o\'chirildi')
  } catch (err: any) {
    errorResponse(res, err.message)
  }
})

// ─── CATEGORIES ──────────────────────────────────────────────────────────────
router.post('/categories', async (req: AuthRequest, res: Response) => {
  try {
    const category = await prisma.category.create({ data: req.body })
    successResponse(res, category, 'Kategoriya yaratildi', 201)
  } catch (err: any) {
    errorResponse(res, err.message)
  }
})

// ─── QUIZZES ─────────────────────────────────────────────────────────────────
router.post('/quizzes', async (req: AuthRequest, res: Response) => {
  try {
    const { questionIds, ...quizData } = req.body
    const quiz = await prisma.quiz.create({
      data: {
        ...quizData,
        createdById: req.user!.userId,
        questionCount: questionIds?.length || 0,
        questions: questionIds
          ? {
              create: questionIds.map((qId: string, idx: number) => ({
                questionId: qId,
                orderIndex: idx,
              })),
            }
          : undefined,
      },
      include: { questions: true },
    })
    successResponse(res, quiz, 'Quiz yaratildi', 201)
  } catch (err: any) {
    errorResponse(res, err.message)
  }
})

// ─── ANALYTICS ───────────────────────────────────────────────────────────────
router.get('/analytics', async (req: AuthRequest, res: Response) => {
  try {
    const [totalUsers, totalQuestions, totalQuizzes, totalResults, recentUsers] = await Promise.all([
      prisma.user.count(),
      prisma.question.count({ where: { isActive: true } }),
      prisma.quiz.count({ where: { isActive: true } }),
      prisma.quizResult.count(),
      prisma.user.findMany({
        take: 5,
        orderBy: { createdAt: 'desc' },
        select: { id: true, email: true, fullName: true, createdAt: true },
      }),
    ])

    const avgScore = await prisma.quizResult.aggregate({ _avg: { percentage: true } })

    successResponse(res, {
      totalUsers,
      totalQuestions,
      totalQuizzes,
      totalResults,
      avgScore: Math.round(avgScore._avg.percentage || 0),
      recentUsers,
    })
  } catch (err: any) {
    errorResponse(res, err.message)
  }
})

export default router
