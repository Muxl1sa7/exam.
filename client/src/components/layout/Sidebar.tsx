import { NavLink, useNavigate } from 'react-router-dom'
import {
  LayoutDashboard, BookOpen, ClipboardList, Bot, Map, Trophy, Medal, User, LogOut, Zap, Shield
} from 'lucide-react'
import { useAuthStore } from '../../store/authStore'
import { authApi } from '../../api/auth.api'

const navItems = [
  { to: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
  { to: '/questions', icon: BookOpen, label: 'Question Bank' },
  { to: '/quizzes', icon: ClipboardList, label: 'Quizzes' },
  { to: '/ai-interview', icon: Bot, label: 'AI Interview' },
  { to: '/roadmap', icon: Map, label: 'Roadmap' },
  { to: '/leaderboard', icon: Trophy, label: 'Leaderboard' },
  { to: '/achievements', icon: Medal, label: 'Achievements' },
]

export default function Sidebar() {
  const { user, logout } = useAuthStore()
  const navigate = useNavigate()

  const handleLogout = async () => {
    try { await authApi.logout() } catch {}
    logout()
    navigate('/login')
  }

  return (
    <aside className="w-60 flex flex-col bg-dark-800 border-r border-slate-800 shrink-0">
      {/* Logo */}
      <div className="p-5 border-b border-slate-800">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-accent-500 flex items-center justify-center">
            <Zap size={16} className="text-dark-900" />
          </div>
          <div>
            <div className="font-sans font-bold text-sm text-white">DevPrep</div>
            <div className="text-xs text-accent-500 font-mono">AI</div>
          </div>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 p-3 space-y-0.5 overflow-y-auto">
        {navItems.map(({ to, icon: Icon, label }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) =>
              `sidebar-link ${isActive ? 'active' : ''}`
            }
          >
            <Icon size={17} />
            <span>{label}</span>
          </NavLink>
        ))}

        {user?.role === 'ADMIN' && (
          <>
            <div className="pt-3 pb-1 px-3">
              <span className="text-xs text-slate-600 uppercase tracking-widest">Admin</span>
            </div>
            <NavLink
              to="/admin/dashboard"
              className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}
            >
              <Shield size={17} />
              <span>Admin Panel</span>
            </NavLink>
          </>
        )}
      </nav>

      {/* User */}
      <div className="p-3 border-t border-slate-800 space-y-0.5">
        <NavLink
          to="/profile"
          className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}
        >
          <User size={17} />
          <div className="flex-1 min-w-0">
            <div className="text-xs text-slate-200 truncate font-semibold">{user?.fullName}</div>
            <div className="text-xs text-slate-500 truncate">{user?.email}</div>
          </div>
        </NavLink>
        <button onClick={handleLogout} className="sidebar-link w-full text-rose-400 hover:text-rose-300 hover:bg-rose-500/10">
          <LogOut size={17} />
          <span>Chiqish</span>
        </button>
      </div>
    </aside>
  )
}
