import { Response, NextFunction } from 'express'
import { verifyAccessToken } from '../utils/jwt'
import { errorResponse } from '../utils/response'
import { AuthRequest } from '../types'

export const authMiddleware = (req: AuthRequest, res: Response, next: NextFunction): void => {
  try {
    const authHeader = req.headers.authorization
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      errorResponse(res, 'Token topilmadi', 401)
      return
    }

    const token = authHeader.split(' ')[1]
    const payload = verifyAccessToken(token)
    req.user = payload
    next()
  } catch {
    errorResponse(res, 'Token noto\'g\'ri yoki muddati o\'tgan', 401)
  }
}
