import { createBrowserRouter, Navigate } from 'react-router-dom'
import { useAuthStore } from './store/authStore'
import Layout from './components/layout/Layout'
import AuthLayout from './components/layout/AuthLayout'

// Auth pages
import Login from './pages/auth/Login'
import Register from './pages/auth/Register'
import ForgotPassword from './pages/auth/ForgotPassword'
import ResetPassword from './pages/auth/ResetPassword'
import VerifyEmail from './pages/auth/VerifyEmail'

// App pages
import Dashboard from './pages/Dashboard'
import QuestionBank from './pages/QuestionBank'
import QuizList from './pages/QuizList'
import QuizSession from './pages/QuizSession'
import QuizResult from './pages/QuizResult'
import AIInterview from './pages/AIInterview'
import Roadmap from './pages/Roadmap'
import Leaderboard from './pages/Leaderboard'
import Profile from './pages/Profile'
import Achievements from './pages/Achievements'

// Admin pages
import AdminLayout from './components/layout/AdminLayout'
import AdminDashboard from './pages/admin/AdminDashboard'
import AdminQuestions from './pages/admin/AdminQuestions'
import AdminUsers from './pages/admin/AdminUsers'
import AdminQuizzes from './pages/admin/AdminQuizzes'

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated)
  return isAuthenticated ? <>{children}</> : <Navigate to="/login" replace />
}

function AdminRoute({ children }: { children: React.ReactNode }) {
  const user = useAuthStore((s) => s.user)
  if (!user) return <Navigate to="/login" replace />
  if (user.role !== 'ADMIN') return <Navigate to="/dashboard" replace />
  return <>{children}</>
}

function GuestRoute({ children }: { children: React.ReactNode }) {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated)
  return isAuthenticated ? <Navigate to="/dashboard" replace /> : <>{children}</>
}

export const router = createBrowserRouter([
  // Auth routes
  {
    element: <AuthLayout />,
    children: [
      { path: '/login', element: <GuestRoute><Login /></GuestRoute> },
      { path: '/register', element: <GuestRoute><Register /></GuestRoute> },
      { path: '/forgot-password', element: <GuestRoute><ForgotPassword /></GuestRoute> },
      { path: '/reset-password', element: <GuestRoute><ResetPassword /></GuestRoute> },
      { path: '/verify-email', element: <VerifyEmail /> },
    ],
  },
  // App routes
  {
    element: <ProtectedRoute><Layout /></ProtectedRoute>,
    children: [
      { path: '/', element: <Navigate to="/dashboard" replace /> },
      { path: '/dashboard', element: <Dashboard /> },
      { path: '/questions', element: <QuestionBank /> },
      { path: '/quizzes', element: <QuizList /> },
      { path: '/quizzes/:id/session', element: <QuizSession /> },
      { path: '/quizzes/results/:id', element: <QuizResult /> },
      { path: '/ai-interview', element: <AIInterview /> },
      { path: '/roadmap', element: <Roadmap /> },
      { path: '/leaderboard', element: <Leaderboard /> },
      { path: '/achievements', element: <Achievements /> },
      { path: '/profile', element: <Profile /> },
    ],
  },
  // Admin routes
  {
    element: <AdminRoute><AdminLayout /></AdminRoute>,
    children: [
      { path: '/admin', element: <Navigate to="/admin/dashboard" replace /> },
      { path: '/admin/dashboard', element: <AdminDashboard /> },
      { path: '/admin/questions', element: <AdminQuestions /> },
      { path: '/admin/users', element: <AdminUsers /> },
      { path: '/admin/quizzes', element: <AdminQuizzes /> },
    ],
  },
])
