import { Router } from 'express'
import { authController } from './auth.controller'
import { authMiddleware } from '../../middleware/auth.middleware'
import { validate } from '../../middleware/validate.middleware'
import {
  registerSchema,
  loginSchema,
  forgotPasswordSchema,
  resetPasswordSchema,
  changePasswordSchema,
  updateProfileSchema,
} from './auth.schema'

const router = Router()

// Public routes
router.post('/register', validate(registerSchema), authController.register.bind(authController))
router.post('/login', validate(loginSchema), authController.login.bind(authController))
router.post('/refresh', authController.refresh.bind(authController))
router.get('/verify-email', authController.verifyEmail.bind(authController))
router.post('/forgot-password', validate(forgotPasswordSchema), authController.forgotPassword.bind(authController))
router.post('/reset-password', validate(resetPasswordSchema), authController.resetPassword.bind(authController))

// Protected routes
router.post('/logout', authMiddleware, authController.logout.bind(authController))
router.get('/me', authMiddleware, authController.getProfile.bind(authController))
router.put('/profile', authMiddleware, validate(updateProfileSchema), authController.updateProfile.bind(authController))
router.put('/change-password', authMiddleware, validate(changePasswordSchema), authController.changePassword.bind(authController))

export default router
