import { useQuery } from '@tanstack/react-query'
import { Trophy, Medal } from 'lucide-react'
import { quizApi } from '../api/quiz.api'
import { PageLoader } from '../components/ui'
import { useAuthStore } from '../store/authStore'
import type { LeaderboardEntry } from '../types'

const trackLabel: Record<string, string> = { FRONTEND: 'Frontend', BACKEND: 'Backend', FULLSTACK: 'Full Stack' }

export default function Leaderboard() {
  const { user } = useAuthStore()
  const { data, isLoading } = useQuery({
    queryKey: ['leaderboard'],
    queryFn: () => quizApi.getLeaderboard().then((r) => r.data.data as LeaderboardEntry[]),
  })

  const rankColors = ['text-amber-400', 'text-slate-400', 'text-orange-600']
  const rankIcons = ['🥇', '🥈', '🥉']

  return (
    <div className="max-w-2xl mx-auto animate-slide-up space-y-6">
      <div className="flex items-center gap-3">
        <Trophy size={24} className="text-amber-400" />
        <div>
          <h1 className="font-sans font-bold text-2xl text-white">Liderlar jadvali</h1>
          <p className="text-slate-400 text-sm">Eng yaxshi o'quvchilar</p>
        </div>
      </div>
      {isLoading ? <PageLoader /> : (
        <div className="space-y-2">
          {(data || []).map((entry) => (
            <div key={entry.user?.id}
              className={`card flex items-center gap-4 transition-all ${entry.user?.id === user?.id ? 'border-accent-200/50 bg-accent-50' : 'hover:border-slate-700'}`}>
              <div className={`w-10 text-center font-bold text-lg ${rankColors[entry.rank - 1] || 'text-slate-500'}`}>
                {entry.rank <= 3 ? rankIcons[entry.rank - 1] : `#${entry.rank}`}
              </div>
              <div className="w-9 h-9 rounded-full bg-gradient-to-br from-accent-500 to-violet-500 flex items-center justify-center font-bold text-dark-900 text-sm shrink-0">
                {entry.user?.fullName?.charAt(0)}
              </div>
              <div className="flex-1 min-w-0">
                <div className="font-semibold text-white text-sm truncate">
                  {entry.user?.fullName}
                  {entry.user?.id === user?.id && <span className="text-xs text-accent-500 ml-2">Sen</span>}
                </div>
                <div className="text-xs text-slate-500">{entry.user?.track ? trackLabel[entry.user.track] : 'Umumiy'}</div>
              </div>
              <div className="text-right">
                <div className="font-bold text-white">{entry.avgScore}%</div>
                <div className="text-xs text-slate-500">{entry.totalQuizzes} test</div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
