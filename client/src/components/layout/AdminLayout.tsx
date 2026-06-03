import { Outlet, NavLink, useNavigate } from 'react-router-dom'
import { LayoutDashboard, HelpCircle, Users, ClipboardList, ArrowLeft, Zap } from 'lucide-react'

export default function AdminLayout() {
  const navigate = useNavigate()
  return (
    <div className="flex h-screen bg-dark-900 overflow-hidden">
      <aside className="w-56 flex flex-col bg-dark-800 border-r border-slate-800 shrink-0">
        <div className="p-4 border-b border-slate-800 flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-rose-500 flex items-center justify-center">
            <Zap size={13} className="text-white" />
          </div>
          <span className="font-sans font-bold text-sm text-white">Admin Panel</span>
        </div>
        <nav className="flex-1 p-3 space-y-0.5">
          {[
            { to: '/admin/dashboard', icon: LayoutDashboard, label: 'Analytics' },
            { to: '/admin/questions', icon: HelpCircle, label: 'Questions' },
            { to: '/admin/quizzes', icon: ClipboardList, label: 'Quizzes' },
            { to: '/admin/users', icon: Users, label: 'Users' },
          ].map(({ to, icon: Icon, label }) => (
            <NavLink key={to} to={to} className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}>
              <Icon size={16} /><span>{label}</span>
            </NavLink>
          ))}
        </nav>
        <div className="p-3 border-t border-slate-800">
          <button onClick={() => navigate('/dashboard')} className="sidebar-link w-full text-slate-400">
            <ArrowLeft size={16} /><span>App ga qaytish</span>
          </button>
        </div>
      </aside>
      <main className="flex-1 overflow-y-auto p-6">
        <Outlet />
      </main>
    </div>
  )
}
