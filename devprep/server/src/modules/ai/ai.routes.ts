import { Router } from 'express'
import { aiController } from './ai.controller'
import { authMiddleware } from '../../middleware/auth.middleware'

const router = Router()

router.use(authMiddleware)

router.post('/evaluate', aiController.evaluateAnswer.bind(aiController))
router.post('/mock-interview/start', aiController.getMockInterviewQuestions.bind(aiController))
router.get('/sessions', aiController.getSessions.bind(aiController))
router.get('/sessions/:id', aiController.getSession.bind(aiController))

export default router
