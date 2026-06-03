import { Router } from 'express'
import { quizzesController } from './quizzes.controller'
import { authMiddleware } from '../../middleware/auth.middleware'

const router = Router()

router.use(authMiddleware)

router.get('/', quizzesController.getQuizzes.bind(quizzesController))
router.get('/leaderboard', quizzesController.getLeaderboard.bind(quizzesController))
router.get('/results/my', quizzesController.getMyResults.bind(quizzesController))
router.get('/results/:id', quizzesController.getResult.bind(quizzesController))
router.get('/:id', quizzesController.getQuiz.bind(quizzesController))
router.post('/:id/start', quizzesController.startQuiz.bind(quizzesController))
router.post('/:id/submit', quizzesController.submitQuiz.bind(quizzesController))

export default router
