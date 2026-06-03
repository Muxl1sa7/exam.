import { Router } from 'express'
import { questionsController } from './questions.controller'
import { authMiddleware } from '../../middleware/auth.middleware'

const router = Router()

router.use(authMiddleware)

router.get('/', questionsController.getQuestions.bind(questionsController))
router.get('/categories', questionsController.getCategories.bind(questionsController))
router.get('/bookmarks', questionsController.getBookmarks.bind(questionsController))
router.get('/:id', questionsController.getQuestion.bind(questionsController))
router.post('/:id/bookmark', questionsController.toggleBookmark.bind(questionsController))

export default router
