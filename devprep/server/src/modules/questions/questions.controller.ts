import { Response } from 'express'
import { questionsService } from './questions.service'
import { successResponse, errorResponse, paginatedResponse } from '../../utils/response'
import { AuthRequest } from '../../types'

export class QuestionsController {
  async getQuestions(req: AuthRequest, res: Response): Promise<void> {
    try {
      const { page, limit, categoryId, difficulty, type, search } = req.query
      const result = await questionsService.getQuestions({
        page: page ? parseInt(page as string) : 1,
        limit: limit ? parseInt(limit as string) : 20,
        categoryId: categoryId as string,
        difficulty: difficulty as string,
        type: type as string,
        search: search as string,
        userId: req.user?.userId,
      })
      paginatedResponse(res, result.questions, { page: result.page, limit: result.limit, total: result.total })
    } catch (err: any) {
      errorResponse(res, err.message)
    }
  }

  async getQuestion(req: AuthRequest, res: Response): Promise<void> {
    try {
      const question = await questionsService.getQuestion(req.params.id, req.user?.userId)
      successResponse(res, question)
    } catch (err: any) {
      errorResponse(res, err.message, 404)
    }
  }

  async getCategories(req: AuthRequest, res: Response): Promise<void> {
    try {
      const categories = await questionsService.getCategories()
      successResponse(res, categories)
    } catch (err: any) {
      errorResponse(res, err.message)
    }
  }

  async toggleBookmark(req: AuthRequest, res: Response): Promise<void> {
    try {
      const result = await questionsService.toggleBookmark(req.user!.userId, req.params.id)
      successResponse(res, result, result.bookmarked ? 'Saqlandi' : 'O\'chirildi')
    } catch (err: any) {
      errorResponse(res, err.message)
    }
  }

  async getBookmarks(req: AuthRequest, res: Response): Promise<void> {
    try {
      const { page, limit } = req.query
      const result = await questionsService.getBookmarks(
        req.user!.userId,
        page ? parseInt(page as string) : 1,
        limit ? parseInt(limit as string) : 20
      )
      paginatedResponse(res, result.bookmarks, { page: result.page, limit: result.limit, total: result.total })
    } catch (err: any) {
      errorResponse(res, err.message)
    }
  }
}

export const questionsController = new QuestionsController()
