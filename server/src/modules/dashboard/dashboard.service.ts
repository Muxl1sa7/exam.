import { prisma } from '../../config/database'

export class DashboardService {
  async getStats(userId: string) {
    const [user, quizResults, aiSessions, bookmarkCount, achievements, roadmapProgress] =
      await Promise.all([
        prisma.user.findUnique({
          where: { id: userId },
          select: { streakCount: true, track: true, fullName: true },
        }),
        prisma.quizResult.findMany({
          where: { userId },
          select: { percentage: true, completedAt: true, quizId: true, answers: true },
          orderBy: { completedAt: 'desc' },
        }),
        prisma.aISession.count({ where: { userId } }),
        prisma.bookmark.count({ where: { userId } }),
        prisma.userAchievement.count({ where: { userId } }),
        prisma.roadmapProgress.count({ where: { userId, isCompleted: true } }),
      ])

    const totalTests = quizResults.length
    const avgScore =
      totalTests > 0 ? Math.round(quizResults.reduce((sum, r) => sum + r.percentage, 0) / totalTests) : 0

    // Interview readiness score (weighted)
    const readinessScore = Math.min(
      100,
      Math.round(
        avgScore * 0.5 +
          Math.min(totalTests * 2, 30) +
          Math.min(aiSessions * 3, 20)
      )
    )

    // Category performance from quiz answers
    const categoryScores: Record<string, { correct: number; total: number }> = {}
    for (const result of quizResults) {
      const answers = result.answers as any[]
      if (Array.isArray(answers)) {
        for (const ans of answers) {
          if (ans.questionTitle) {
            // simplified - in real app track category from answer
          }
        }
      }
    }

    // Recent activity (last 7 days per day)
    const last7Days = Array.from({ length: 7 }, (_, i) => {
      const d = new Date()
      d.setDate(d.getDate() - (6 - i))
      d.setHours(0, 0, 0, 0)
      return d
    })

    const weeklyActivity = last7Days.map((day) => {
      const nextDay = new Date(day)
      nextDay.setDate(nextDay.getDate() + 1)
      const dayResults = quizResults.filter(
        (r) => r.completedAt >= day && r.completedAt < nextDay
      )
      const dayScore = dayResults.length > 0
        ? Math.round(dayResults.reduce((s, r) => s + r.percentage, 0) / dayResults.length)
        : 0
      return {
        date: day.toISOString().split('T')[0],
        day: ['Yak', 'Du', 'Se', 'Cho', 'Pay', 'Ju', 'Sha'][day.getDay()],
        score: dayScore,
        tests: dayResults.length,
      }
    })

    return {
      totalTests,
      avgScore,
      readinessScore,
      streakCount: user?.streakCount || 0,
      aiSessionsCount: aiSessions,
      bookmarkCount,
      achievementsCount: achievements,
      roadmapCompleted: roadmapProgress,
      weeklyActivity,
      track: user?.track,
    }
  }

  async getRoadmap(track: string, userId: string) {
    const nodes = await prisma.roadmapNode.findMany({
      where: { track: track.toUpperCase() as any },
      include: {
        progress: { where: { userId }, select: { isCompleted: true, completedAt: true } },
      },
      orderBy: { orderIndex: 'asc' },
    })

    return nodes.map((node) => ({
      id: node.id,
      title: node.title,
      description: node.description,
      orderIndex: node.orderIndex,
      parentId: node.parentId,
      isMilestone: node.isMilestone,
      resources: node.resources,
      isCompleted: node.progress[0]?.isCompleted || false,
      completedAt: node.progress[0]?.completedAt || null,
    }))
  }

  async completeNode(userId: string, nodeId: string) {
    const progress = await prisma.roadmapProgress.upsert({
      where: { userId_nodeId: { userId, nodeId } },
      update: { isCompleted: true, completedAt: new Date() },
      create: { userId, nodeId, isCompleted: true, completedAt: new Date() },
    })
    return progress
  }

  async getNotifications(userId: string) {
    const notifications = await prisma.notification.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      take: 20,
    })
    const unreadCount = await prisma.notification.count({ where: { userId, isRead: false } })
    return { notifications, unreadCount }
  }

  async markNotificationRead(id: string, userId: string) {
    await prisma.notification.updateMany({ where: { id, userId }, data: { isRead: true } })
  }

  async getAchievements(userId: string) {
    const [all, earned] = await Promise.all([
      prisma.achievement.findMany({ orderBy: { conditionValue: 'asc' } }),
      prisma.userAchievement.findMany({
        where: { userId },
        include: { achievement: true },
      }),
    ])

    return all.map((ach) => {
      const userAch = earned.find((e) => e.achievementId === ach.id)
      return { ...ach, isEarned: !!userAch, earnedAt: userAch?.earnedAt || null }
    })
  }
}

export const dashboardService = new DashboardService()
