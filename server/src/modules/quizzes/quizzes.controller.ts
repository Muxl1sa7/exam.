import { Response } from 'express'
import { quizzesService } from './quizzes.service'
import { successResponse, errorResponse, paginatedResponse } from '../../utils/response'
import { AuthRequest } from '../../types'

export class QuizzesController {
  async getQuizzes(req: AuthRequest, res: Response): Promise<void> {
    try {
      const { type, difficulty, page, limit } = req.query
      const result = await quizzesService.getQuizzes({
        type: type as string,
        difficulty: difficulty as string,
        page: page ? parseInt(page as string) : 1,
        limit: limit ? parseInt(limit as string) : 10,
      })
      paginatedResponse(res, result.quizzes, { page: result.page, limit: result.limit, total: result.total })
    } catch (err: any) {
      errorResponse(res, err.message)
    }
  }

  async getQuiz(req: AuthRequest, res: Response): Promise<void> {
    try {
      const quiz = await quizzesService.getQuiz(req.params.id)
      successResponse(res, quiz)
    } catch (err: any) {
      errorResponse(res, err.message, 404)
    }
  }

  async startQuiz(req: AuthRequest, res: Response): Promise<void> {
    try {
      const quiz = await quizzesService.startQuiz(req.params.id)
      successResponse(res, quiz, 'Quiz boshlandi')
    } catch (err: any) {
      errorResponse(res, err.message, 404)
    }
  }

  async submitQuiz(req: AuthRequest, res: Response): Promise<void> {
    try {
      const result = await quizzesService.submitQuiz(req.params.id, req.user!.userId, req.body)
      successResponse(res, result, 'Quiz yakunlandi')
    } catch (err: any) {
      errorResponse(res, err.message)
    }
  }

  async getMyResults(req: AuthRequest, res: Response): Promise<void> {
    try {
      const { page, limit } = req.query
      const result = await quizzesService.getMyResults(
        req.user!.userId,
        page ? parseInt(page as string) : 1,
        limit ? parseInt(limit as string) : 10
      )
      paginatedResponse(res, result.results, { page: result.page, limit: result.limit, total: result.total })
    } catch (err: any) {
      errorResponse(res, err.message)
    }
  }

  async getResult(req: AuthRequest, res: Response): Promise<void> {
    try {
      const result = await quizzesService.getResult(req.params.id, req.user!.userId)
      successResponse(res, result)
    } catch (err: any) {
      errorResponse(res, err.message, 404)
    }
  }

  async getLeaderboard(req: AuthRequest, res: Response): Promise<void> {
    try {
      const leaderboard = await quizzesService.getLeaderboard()
      successResponse(res, leaderboard)
    } catch (err: any) {
      errorResponse(res, err.message)
    }
  }
}

export const quizzesController = new QuizzesController()
