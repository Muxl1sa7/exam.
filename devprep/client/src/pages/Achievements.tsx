import { useQuery } from '@tanstack/react-query'
import { dashboardApi } from '../api/dashboard.api'
import { PageLoader } from '../components/ui'
import type { Achievement } from '../types'

export default function Achievements() {
  const { data, isLoading } = useQuery({
    queryKey: ['achievements'],
    queryFn: () => dashboardApi.getAchievements().then((r) => r.data.data as Achievement[]),
  })
  const earned = data?.filter((a) => a.isEarned) || []

  return (
    <div className="animate-slide-up space-y-6">
      <div>
        <h1 className="font-sans font-bold text-2xl text-white">Badgelar</h1>
        <p className="text-slate-400 text-sm mt-1">{earned.length} / {data?.length || 0} badge qozonildi</p>
      </div>
      {isLoading ? <PageLoader /> : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {(data || []).map((ach) => (
            <div key={ach.id}
              className={`card text-center transition-all ${ach.isEarned ? 'border-amber-500/30 bg-amber-500/5' : 'opacity-50 grayscale'}`}>
              <div className="text-4xl mb-3">{ach.icon || '🏆'}</div>
              <div className={`font-semibold text-sm mb-1 ${ach.isEarned ? 'text-white' : 'text-slate-500'}`}>{ach.title}</div>
              <div className="text-xs text-slate-500 leading-relaxed">{ach.description}</div>
              {ach.isEarned && ach.earnedAt && (
                <div className="text-xs text-amber-400 mt-2">
                  {new Date(ach.earnedAt).toLocaleDateString('uz-UZ')}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
