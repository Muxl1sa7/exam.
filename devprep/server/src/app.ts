import express from 'express'
import cors from 'cors'
import helmet from 'helmet'
import morgan from 'morgan'
import cookieParser from 'cookie-parser'
import { env } from './config/env'
import { globalLimiter, authLimiter, aiLimiter } from './middleware/rateLimit'

// Routes
import authRoutes from './modules/auth/auth.routes'
import questionsRoutes from './modules/questions/questions.routes'
import quizzesRoutes from './modules/quizzes/quizzes.routes'
import aiRoutes from './modules/ai/ai.routes'
import dashboardRoutes from './modules/dashboard/dashboard.routes'
import adminRoutes from './modules/admin/admin.routes'

const app = express()

// ─── SECURITY ────────────────────────────────────────────────────────────────
app.use(helmet())
app.use(
  cors({
    origin: env.clientUrl,
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  })
)

// ─── RATE LIMITING ───────────────────────────────────────────────────────────
app.use('/api/v1/auth', authLimiter)
app.use('/api/v1/ai', aiLimiter)
app.use(globalLimiter)

// ─── MIDDLEWARE ──────────────────────────────────────────────────────────────
app.use(morgan(env.nodeEnv === 'development' ? 'dev' : 'combined'))
app.use(express.json({ limit: '10mb' }))
app.use(express.urlencoded({ extended: true }))
app.use(cookieParser())

// ─── HEALTH CHECK ────────────────────────────────────────────────────────────
app.get('/health', (_, res) => {
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    service: 'DevPrep AI API',
    version: '1.0.0',
  })
})

// ─── ROUTES ──────────────────────────────────────────────────────────────────
app.use('/api/v1/auth', authRoutes)
app.use('/api/v1/questions', questionsRoutes)
app.use('/api/v1/quizzes', quizzesRoutes)
app.use('/api/v1/ai', aiRoutes)
app.use('/api/v1/dashboard', dashboardRoutes)
app.use('/api/v1/admin', adminRoutes)

// ─── 404 ─────────────────────────────────────────────────────────────────────
app.use('*', (_, res) => {
  res.status(404).json({ success: false, message: 'Route topilmadi' })
})

// ─── GLOBAL ERROR HANDLER ────────────────────────────────────────────────────
app.use((err: Error, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
  console.error('Unhandled error:', err.message)
  res.status(500).json({ success: false, message: 'Server xatosi yuz berdi' })
})

export default app
