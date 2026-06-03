export interface User {
  id: string
  email: string
  fullName: string
  avatarUrl?: string
  role: 'USER' | 'ADMIN'
  track?: 'FRONTEND' | 'BACKEND' | 'FULLSTACK'
  isVerified: boolean
  streakCount: number
  lastActive?: string
  createdAt: string
  _count?: { quizResults: number; bookmarks: number; aiSessions: number }
}

export interface Category {
  id: string
  name: string
  slug: string
  group: 'FRONTEND' | 'BACKEND' | 'GENERAL'
  icon?: string
  questionCount?: number
}

export interface Question {
  id: string
  categoryId: string
  category: Category
  title: string
  type: 'MULTIPLE_CHOICE' | 'SINGLE_CHOICE' | 'OPEN_ENDED'
  difficulty: 'EASY' | 'MEDIUM' | 'HARD'
  options?: Array<{ id: string; text: string; isCorrect: boolean }>
  correctAnswer?: string
  explanation?: string
  tags: string[]
  isActive: boolean
  isBookmarked?: boolean
  createdAt: string
}

export interface Quiz {
  id: string
  title: string
  description?: string
  type: 'FRONTEND' | 'BACKEND' | 'FULLSTACK'
  difficulty: 'EASY' | 'MEDIUM' | 'HARD' | 'MIXED'
  timeLimit: number
  questionCount: number
  isActive: boolean
  createdAt: string
  _count?: { results: number }
}

export interface QuizSession {
  id: string
  title: string
  description?: string
  type: string
  difficulty: string
  timeLimit: number
  questions: Question[]
}

export interface QuizResult {
  id: string
  userId: string
  quizId: string
  score: number
  total: number
  percentage: number
  timeSpent: number
  answers: AnswerDetail[]
  completedAt: string
  quiz?: Quiz
}

export interface AnswerDetail {
  questionId: string
  questionTitle: string
  selectedOptionId?: string
  textAnswer?: string
  isCorrect: boolean
  correctAnswer?: string
  correctOptionId?: string
  explanation?: string
}

export interface AISession {
  id: string
  questionText: string
  userAnswer: string
  aiScore: number
  aiFeedback: string
  idealAnswer: string
  resources?: Array<{ title: string; url: string; type: string }>
  createdAt: string
}

export interface AIEvalResult {
  sessionId: string
  score: number
  feedback: string
  idealAnswer: string
  mistakes: string[]
  resources: Array<{ title: string; url: string; type: string }>
  keyPoints: string[]
}

export interface RoadmapNode {
  id: string
  track: string
  title: string
  description?: string
  orderIndex: number
  parentId?: string
  isMilestone: boolean
  resources?: Array<{ title: string; url: string }>
  isCompleted: boolean
  completedAt?: string
}

export interface Achievement {
  id: string
  slug: string
  title: string
  description?: string
  icon?: string
  conditionType: string
  conditionValue: number
  isEarned: boolean
  earnedAt?: string
}

export interface Notification {
  id: string
  type: 'QUIZ_RESULT' | 'ACHIEVEMENT' | 'ROADMAP' | 'SYSTEM'
  title: string
  message?: string
  isRead: boolean
  createdAt: string
}

export interface DashboardStats {
  totalTests: number
  avgScore: number
  readinessScore: number
  streakCount: number
  aiSessionsCount: number
  bookmarkCount: number
  achievementsCount: number
  roadmapCompleted: number
  weeklyActivity: Array<{ date: string; day: string; score: number; tests: number }>
  track?: string
}

export interface LeaderboardEntry {
  rank: number
  user: Pick<User, 'id' | 'fullName' | 'avatarUrl' | 'track'>
  avgScore: number
  totalQuizzes: number
  bestScore: number
}

export interface PaginatedResponse<T> {
  success: boolean
  data: T[]
  pagination: { page: number; limit: number; total: number; totalPages: number }
}

export interface ApiResponse<T> {
  success: boolean
  message: string
  data: T
}
