import { prisma } from '../../config/database'
import { Difficulty, QuestionType } from '@prisma/client'

interface GetQuestionsParams {
  page?: number
  limit?: number
  categoryId?: string
  difficulty?: string
  type?: string
  search?: string
  userId?: string
}

export class QuestionsService {
  async getQuestions(params: GetQuestionsParams) {
    const { page = 1, limit = 20, categoryId, difficulty, type, search, userId } = params
    const skip = (page - 1) * limit

    const where: any = { isActive: true }
    if (categoryId) where.categoryId = categoryId
    if (difficulty) where.difficulty = difficulty as Difficulty
    if (type) where.type = type as QuestionType
    if (search) where.title = { contains: search, mode: 'insensitive' }

    const [questions, total] = await Promise.all([
      prisma.question.findMany({
        where,
        skip,
        take: limit,
        include: {
          category: { select: { id: true, name: true, slug: true, group: true, icon: true } },
          bookmarks: userId ? { where: { userId }, select: { id: true } } : false,
        },
        orderBy: { createdAt: 'desc' },
      }),
      prisma.question.count({ where }),
    ])

    return {
      questions: questions.map((q) => ({
        ...q,
        isBookmarked: userId ? q.bookmarks.length > 0 : false,
        bookmarks: undefined,
      })),
      total,
      page,
      limit,
    }
  }

  async getQuestion(id: string, userId?: string) {
    const question = await prisma.question.findFirst({
      where: { id, isActive: true },
      include: {
        category: true,
        bookmarks: userId ? { where: { userId }, select: { id: true } } : false,
      },
    })
    if (!question) throw new Error('Savol topilmadi')

    return {
      ...question,
      isBookmarked: userId ? question.bookmarks.length > 0 : false,
      bookmarks: undefined,
    }
  }

  async getCategories() {
    const categories = await prisma.category.findMany({
      include: {
        _count: { select: { questions: { where: { isActive: true } } } },
      },
      orderBy: { name: 'asc' },
    })
    return categories.map((c) => ({ ...c, questionCount: c._count.questions }))
  }

  async toggleBookmark(userId: string, questionId: string) {
    const existing = await prisma.bookmark.findUnique({
      where: { userId_questionId: { userId, questionId } },
    })

    if (existing) {
      await prisma.bookmark.delete({ where: { id: existing.id } })
      return { bookmarked: false }
    } else {
      await prisma.bookmark.create({ data: { userId, questionId } })
      return { bookmarked: true }
    }
  }

  async getBookmarks(userId: string, page = 1, limit = 20) {
    const skip = (page - 1) * limit
    const [bookmarks, total] = await Promise.all([
      prisma.bookmark.findMany({
        where: { userId },
        skip,
        take: limit,
        include: {
          question: {
            include: { category: { select: { id: true, name: true, slug: true, icon: true } } },
          },
        },
        orderBy: { createdAt: 'desc' },
      }),
      prisma.bookmark.count({ where: { userId } }),
    ])

    return { bookmarks: bookmarks.map((b) => ({ ...b.question, bookmarkedAt: b.createdAt })), total, page, limit }
  }
}

export const questionsService = new QuestionsService()
