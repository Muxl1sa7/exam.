import { Bell, Sun, Moon, Flame } from 'lucide-react'
import { useQuery } from '@tanstack/react-query'
import { useAuthStore } from '../../store/authStore'
import { useThemeStore } from '../../store/themeStore'
import { dashboardApi } from '../../api/dashboard.api'

export default function Navbar() {
  const { user } = useAuthStore()
  const { theme, toggleTheme } = useThemeStore()

  const { data: notifData } = useQuery({
    queryKey: ['notifications'],
    queryFn: () => dashboardApi.getNotifications().then((r) => r.data.data),
    refetchInterval: 60000,
  })

  const unread = notifData?.unreadCount || 0

  return (
    <header className="h-14 flex items-center justify-between px-6 border-b border-slate-800 bg-dark-800 shrink-0">
      <div>
        <h1 className="text-sm font-semibold text-slate-200">
          Salom, <span className="text-accent-500">{user?.fullName?.split(' ')[0]}</span> 👋
        </h1>
        <p className="text-xs text-slate-500">Bugun ham o'rganishni davom ettiring</p>
      </div>

      <div className="flex items-center gap-2">
        {/* Streak */}
        {(user?.streakCount || 0) > 0 && (
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-amber-500/10 border border-amber-500/20">
            <Flame size={14} className="text-amber-400" />
            <span className="text-xs font-bold text-amber-400">{user?.streakCount}</span>
          </div>
        )}

        {/* Theme */}
        <button
          onClick={toggleTheme}
          className="p-2 rounded-lg text-slate-400 hover:text-slate-200 hover:bg-slate-800 transition-colors"
        >
          {theme === 'dark' ? <Sun size={16} /> : <Moon size={16} />}
        </button>

        {/* Notifications */}
        <button className="relative p-2 rounded-lg text-slate-400 hover:text-slate-200 hover:bg-slate-800 transition-colors">
          <Bell size={16} />
          {unread > 0 && (
            <span className="absolute top-1 right-1 w-2 h-2 bg-accent-500 rounded-full" />
          )}
        </button>

        {/* Avatar */}
        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-accent-500 to-violet-500 flex items-center justify-center text-dark-900 font-bold text-xs">
          {user?.fullName?.charAt(0).toUpperCase()}
        </div>
      </div>
    </header>
  )
}
