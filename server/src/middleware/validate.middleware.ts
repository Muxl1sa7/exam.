import { Request, Response, NextFunction } from 'express'
import { ZodSchema } from 'zod'
import { errorResponse } from '../utils/response'

export const validate =
  (schema: ZodSchema) =>
  (req: Request, res: Response, next: NextFunction): void => {
    const result = schema.safeParse(req.body)
    if (!result.success) {
      errorResponse(
        res,
        'Validation xatosi',
        400,
        result.error.errors.map((e) => ({ field: e.path.join('.'), message: e.message }))
      )
      return
    }
    req.body = result.data
    next()
  }
