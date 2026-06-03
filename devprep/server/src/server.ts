import app from './app'
import { env } from './config/env'
import { prisma } from './config/database'

const startServer = async () => {
  try {
    // Test database connection
    await prisma.$connect()
    console.log('✅ PostgreSQL (Neon) ga ulanildi')

    app.listen(env.port, () => {
      console.log(`
🚀 DevPrep AI Server ishga tushdi!
   Port:     ${env.port}
   Mode:     ${env.nodeEnv}
   API:      http://localhost:${env.port}/api/v1
   Health:   http://localhost:${env.port}/health
      `)
    })
  } catch (error) {
    console.error('❌ Server ishga tushmadi:', error)
    await prisma.$disconnect()
    process.exit(1)
  }
}

process.on('SIGINT', async () => {
  console.log('\n👋 Server to\'xtatilmoqda...')
  await prisma.$disconnect()
  process.exit(0)
})

process.on('SIGTERM', async () => {
  await prisma.$disconnect()
  process.exit(0)
})

startServer()
