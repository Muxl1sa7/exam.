import { Response } from 'express'
import { aiService } from './ai.service'
import { successResponse, errorResponse, paginatedResponse } from '../../utils/response'
import { AuthRequest } from '../../types'

export class AIController {
  async evaluateAnswer(req: AuthRequest, res: Response): Promise<void> {
    try {
      const result = await aiService.evaluateAnswer(req.user!.userId, req.body)
      successResponse(res, result, 'Javob baholandi')
    } catch (err: any) {
      errorResponse(res, err.message)
    }
  }

  async getMockInterviewQuestions(req: AuthRequest, res: Response): Promise<void> {
    try {
      const result = await aiService.getMockInterviewQuestions(req.body)
      successResponse(res, result, 'Mock interview savollar tayyor')
    } catch (err: any) {
      errorResponse(res, err.message)
    }
  }

  async getSessions(req: AuthRequest, res: Response): Promise<void> {
    try {
      const { page, limit } = req.query
      const result = await aiService.getSessions(
        req.user!.userId,
        page ? parseInt(page as string) : 1,
        limit ? parseInt(limit as string) : 10
      )
      paginatedResponse(res, result.sessions, { page: result.page, limit: result.limit, total: result.total })
    } catch (err: any) {
      errorResponse(res, err.message)
    }
  }

  async getSession(req: AuthRequest, res: Response): Promise<void> {
    try {
      const session = await aiService.getSession(req.params.id, req.user!.userId)
      successResponse(res, session)
    } catch (err: any) {
      errorResponse(res, err.message, 404)
    }
  }
}

export const aiController = new AIController()
