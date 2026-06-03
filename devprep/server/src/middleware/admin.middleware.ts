import { Response, NextFunction } from 'express'
import { errorResponse } from '../utils/response'
import { AuthRequest } from '../types'

export const adminMiddleware = (req: AuthRequest, res: Response, next: NextFunction): void => {
  if (!req.user || req.user.role !== 'ADMIN') {
    errorResponse(res, 'Admin huquqi talab qilinadi', 403)
    return
  }
  next()
}
