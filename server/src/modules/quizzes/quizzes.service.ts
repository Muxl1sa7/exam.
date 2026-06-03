import { prisma } from '../../config/database'
import { Track, Difficulty } from '@prisma/client'

interface SubmitAnswers {
  answers: Array<{ questionId: string; selectedOptionId?: string; textAnswer?: string }>
  timeSpent: number
}

export class QuizzesService {
  async getQuizzes(params: { type?: string; difficulty?: string; page?: number; limit?: number }) {
    const { type, difficulty, page = 1, limit = 10 } = params
    const skip = (page - 1) * limit

    const where: any = { isActive: true }
    if (type) where.type = type as Track
    if (difficulty) where.difficulty = difficulty as Difficulty

    const [quizzes, total] = await Promise.all([
      prisma.quiz.findMany({
        where,
        skip,
        take: limit,
        include: { _count: { select: { results: true } } },
        orderBy: { createdAt: 'desc' },
      }),
      prisma.quiz.count({ where }),
    ])

    return { quizzes, total, page, limit }
  }

  async getQuiz(id: string) {
    const quiz = await prisma.quiz.findFirst({
      where: { id, isActive: true },
      include: {
        questions: {
          include: {
            question: {
              include: { category: { select: { name: true, slug: true } } },
            },
          },
          orderBy: { orderIndex: 'asc' },
        },
      },
    })
    if (!quiz) throw new Error('Quiz topilmadi')
    return quiz
  }

  async startQuiz(id: string) {
    const quiz = await prisma.quiz.findFirst({
      where: { id, isActive: true },
      include: {
        questions: {
          include: {
            question: {
              select: {
                id: true,
                title: true,
                type: true,
                difficulty: true,
                options: true,
                category: { select: { name: true } },
                // NOTE: correctAnswer NOT included for security
              },
            },
          },
          orderBy: { orderIndex: 'asc' },
        },
      },
    })
    if (!quiz) throw new Error('Quiz topilmadi')

    return {
      id: quiz.id,
      title: quiz.title,
      description: quiz.description,
      type: quiz.type,
      difficulty: quiz.difficulty,
      timeLimit: quiz.timeLimit,
      questions: quiz.questions.map((qq) => qq.question),
    }
  }

  async submitQuiz(quizId: string, userId: string, dto: SubmitAnswers) {
    const quiz = await prisma.quiz.findFirst({
      where: { id: quizId, isActive: true },
      include: {
        questions: {
          include: { question: true },
          orderBy: { orderIndex: 'asc' },
        },
      },
    })
    if (!quiz) throw new Error('Quiz topilmadi')

    let score = 0
    const detailedAnswers = dto.answers.map((ans) => {
      const quizQuestion = quiz.questions.find((qq) => qq.questionId === ans.questionId)
      if (!quizQuestion) return { ...ans, isCorrect: false, correctAnswer: null, explanation: null }

      const question = quizQuestion.question
      let isCorrect = false

      if (question.type === 'OPEN_ENDED') {
        isCorrect = false // AI evaluates open-ended
      } else if (question.options && ans.selectedOptionId) {
        const options = question.options as Array<{ id: string; text: string; isCorrect: boolean }>
        const selectedOption = options.find((o) => o.id === ans.selectedOptionId)
        isCorrect = selectedOption?.isCorrect || false
      }

      if (isCorrect) score++

      return {
        questionId: ans.questionId,
        questionTitle: question.title,
        selectedOptionId: ans.selectedOptionId,
        textAnswer: ans.textAnswer,
        isCorrect,
        correctAnswer: question.correctAnswer,
        correctOptionId: question.options
          ? (question.options as any[]).find((o) => o.isCorrect)?.id
          : null,
        explanation: question.explanation,
      }
    })

    const total = quiz.questions.length
    const percentage = total > 0 ? (score / total) * 100 : 0

    const result = await prisma.quizResult.create({
      data: {
        userId,
        quizId,
        score,
        total,
        percentage,
        timeSpent: dto.timeSpent,
        answers: detailedAnswers,
      },
    })

    // Check achievements
    await this.checkAchievements(userId)

    return { ...result, detailedAnswers }
  }

  async getMyResults(userId: string, page = 1, limit = 10) {
    const skip = (page - 1) * limit
    const [results, total] = await Promise.all([
      prisma.quizResult.findMany({
        where: { userId },
        skip,
        take: limit,
        include: { quiz: { select: { id: true, title: true, type: true, difficulty: true } } },
        orderBy: { completedAt: 'desc' },
      }),
      prisma.quizResult.count({ where: { userId } }),
    ])
    return { results, total, page, limit }
  }

  async getResult(id: string, userId: string) {
    const result = await prisma.quizResult.findFirst({
      where: { id, userId },
      include: { quiz: true },
    })
    if (!result) throw new Error('Natija topilmadi')
    return result
  }

  async getLeaderboard() {
    const results = await prisma.quizResult.groupBy({
      by: ['userId'],
      _avg: { percentage: true },
      _count: { id: true },
      _max: { percentage: true },
      orderBy: { _avg: { percentage: 'desc' } },
      take: 50,
    })

    const userIds = results.map((r) => r.userId)
    const users = await prisma.user.findMany({
      where: { id: { in: userIds } },
      select: { id: true, fullName: true, avatarUrl: true, track: true },
    })

    return results.map((r, index) => {
      const user = users.find((u) => u.id === r.userId)
      return {
        rank: index + 1,
        user,
        avgScore: Math.round(r._avg.percentage || 0),
        totalQuizzes: r._count.id,
        bestScore: Math.round(r._max.percentage || 0),
      }
    })
  }

  private async checkAchievements(userId: string) {
    try {
      const quizCount = await prisma.quizResult.count({ where: { userId } })
      const achievements = await prisma.achievement.findMany({
        where: { conditionType: 'QUIZ_COUNT' },
      })

      for (const ach of achievements) {
        if (quizCount >= ach.conditionValue) {
          const existing = await prisma.userAchievement.findUnique({
            where: { userId_achievementId: { userId, achievementId: ach.id } },
          })
          if (!existing) {
            await prisma.userAchievement.create({ data: { userId, achievementId: ach.id } })
            await prisma.notification.create({
              data: {
                userId,
                type: 'ACHIEVEMENT',
                title: `🏆 Yangi badge: ${ach.title}`,
                message: ach.description || '',
              },
            })
          }
        }
      }
    } catch {
      // Non-critical
    }
  }
}

export const quizzesService = new QuizzesService()
