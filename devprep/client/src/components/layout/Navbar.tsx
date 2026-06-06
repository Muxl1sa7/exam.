import { useState, useRef, useEffect } from 'react'
import { Bell, Sun, Moon, Flame, CheckCheck } from 'lucide-react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useAuthStore } from '../../store/authStore'
import { useThemeStore } from '../../store/themeStore'
import { dashboardApi } from '../../api/dashboard.api'

export default function Navbar() {
  const { user } = useAuthStore()
  const { theme, toggleTheme } = useThemeStore()
  const qc = useQueryClient()
  const [showNotifs, setShowNotifs] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)

  const { data: notifData } = useQuery({
    queryKey: ['notifications'],
    queryFn: () => dashboardApi.getNotifications().then((r) => r.data.data),
    refetchInterval: 60000,
  })

  const markReadMutation = useMutation({
    mutationFn: (id: string) => dashboardApi.markRead(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['notifications'] }),
  })

  const unread = notifData?.unreadCount || 0
  const notifications = notifData?.notifications || []

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setShowNotifs(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

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
        <div className="relative" ref={dropdownRef}>
          <button
            onClick={() => setShowNotifs((v) => !v)}
            className="relative p-2 rounded-lg text-slate-400 hover:text-slate-200 hover:bg-slate-800 transition-colors"
          >
            <Bell size={16} />
            {unread > 0 && (
              <span className="absolute top-1 right-1 w-2 h-2 bg-accent-500 rounded-full" />
            )}
          </button>

          {showNotifs && (
            <div className="absolute right-0 top-10 w-80 bg-dark-800 border border-slate-700 rounded-xl shadow-xl z-50 overflow-hidden">
              <div className="flex items-center justify-between px-4 py-3 border-b border-slate-700">
                <span className="text-sm font-semibold text-white">Bildirishnomalar</span>
                {unread > 0 && (
                  <span className="text-xs bg-accent-500/20 text-accent-400 px-2 py-0.5 rounded-full">
                    {unread} yangi
                  </span>
                )}
              </div>

              <div className="max-h-72 overflow-y-auto">
                {notifications.length === 0 ? (
                  <div className="py-8 text-center text-slate-500 text-sm">
                    Bildirishnomalar yo'q
                  </div>
                ) : (
                  notifications.map((n: any) => (
                    <div
                      key={n.id}
                      className={`px-4 py-3 border-b border-slate-800 hover:bg-slate-800/50 transition-colors ${!n.isRead ? 'bg-accent-500/5' : ''}`}
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex-1 min-w-0">
                          <p className={`text-sm ${!n.isRead ? 'text-white font-medium' : 'text-slate-300'}`}>
                            {n.title}
                          </p>
                          {n.message && (
                            <p className="text-xs text-slate-500 mt-0.5 line-clamp-2">{n.message}</p>
                          )}
                          <p className="text-xs text-slate-600 mt-1">
                            {new Date(n.createdAt).toLocaleDateString('uz-UZ')}
                          </p>
                        </div>
                        {!n.isRead && (
                          <button
                            onClick={() => markReadMutation.mutate(n.id)}
                            className="shrink-0 p-1 text-slate-500 hover:text-accent-400 transition-colors"
                            title="O'qildi deb belgilash"
                          >
                            <CheckCheck size={14} />
                          </button>
                        )}
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </div>

        {/* Avatar */}
        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-accent-500 to-violet-500 flex items-center justify-center text-dark-900 font-bold text-xs">
          {user?.fullName?.charAt(0).toUpperCase()}
        </div>
      </div>
    </header>
  )
}
