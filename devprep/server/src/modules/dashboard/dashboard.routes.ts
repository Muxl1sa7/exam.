import { Router, Response } from 'express'
import { dashboardService } from './dashboard.service'
import { successResponse, errorResponse } from '../../utils/response'
import { authMiddleware } from '../../middleware/auth.middleware'
import { AuthRequest } from '../../types'

const router = Router()
router.use(authMiddleware)

router.get('/stats', async (req: AuthRequest, res: Response) => {
  try {
    const stats = await dashboardService.getStats(req.user!.userId)
    successResponse(res, stats)
  } catch (err: any) {
    errorResponse(res, err.message)
  }
})

router.get('/roadmap/:track', async (req: AuthRequest, res: Response) => {
  try {
    const { track } = req.params
    const nodes = await dashboardService.getRoadmap(track, req.user!.userId)
    successResponse(res, nodes)
  } catch (err: any) {
    errorResponse(res, err.message)
  }
})

router.post('/roadmap/:nodeId/complete', async (req: AuthRequest, res: Response) => {
  try {
    const progress = await dashboardService.completeNode(req.user!.userId, req.params.nodeId)
    successResponse(res, progress, 'Tugatildi!')
  } catch (err: any) {
    errorResponse(res, err.message)
  }
})

router.get('/notifications', async (req: AuthRequest, res: Response) => {
  try {
    const data = await dashboardService.getNotifications(req.user!.userId)
    successResponse(res, data)
  } catch (err: any) {
    errorResponse(res, err.message)
  }
})

router.patch('/notifications/:id/read', async (req: AuthRequest, res: Response) => {
  try {
    await dashboardService.markNotificationRead(req.params.id, req.user!.userId)
    successResponse(res, null, 'O\'qildi')
  } catch (err: any) {
    errorResponse(res, err.message)
  }
})

router.get('/achievements', async (req: AuthRequest, res: Response) => {
  try {
    const achievements = await dashboardService.getAchievements(req.user!.userId)
    successResponse(res, achievements)
  } catch (err: any) {
    errorResponse(res, err.message)
  }
})

export default router
