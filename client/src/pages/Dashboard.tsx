import { useQuery } from '@tanstack/react-query'
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, AreaChart, Area } from 'recharts'
import { Trophy, Flame, BookOpen, Bot, Map, Medal, Target, TrendingUp } from 'lucide-react'
import { dashboardApi } from '../api/dashboard.api'
import { useAuthStore } from '../store/authStore'
import { PageLoader, ScoreRing } from '../components/ui'

const trackLabel: Record<string, string> = { FRONTEND: 'Frontend', BACKEND: 'Backend', FULLSTACK: 'Full Stack' }

export default function Dashboard() {
  const { user } = useAuthStore()
  const { data: stats, isLoading } = useQuery({
    queryKey: ['dashboard-stats'],
    queryFn: () => dashboardApi.getStats().then((r) => r.data.data),
  })

  if (isLoading) return <PageLoader />

  const s = stats!

  const statCards = [
    { label: 'Jami testlar', value: s.totalTests, icon: Trophy, color: 'text-amber-400', bg: 'bg-amber-500/10' },
    { label: "O'rtacha ball", value: `${s.avgScore}%`, icon: TrendingUp, color: 'text-emerald-400', bg: 'bg-emerald-500/10' },
    { label: 'Kunlik streak', value: `${s.streakCount} kun`, icon: Flame, color: 'text-orange-400', bg: 'bg-orange-500/10' },
    { label: 'AI sessiyalar', value: s.aiSessionsCount, icon: Bot, color: 'text-violet-400', bg: 'bg-violet-500/10' },
    { label: 'Saqlangan', value: s.bookmarkCount, icon: BookOpen, color: 'text-accent-500', bg: 'bg-accent-100' },
    { label: 'Roadmap', value: `${s.roadmapCompleted} tugatildi`, icon: Map, color: 'text-pink-400', bg: 'bg-pink-500/10' },
    { label: 'Badgelar', value: s.achievementsCount, icon: Medal, color: 'text-yellow-400', bg: 'bg-yellow-500/10' },
    { label: 'Yo\'nalish', value: trackLabel[s.track || ''] || 'Tanlanmagan', icon: Target, color: 'text-slate-400', bg: 'bg-slate-800' },
  ]

  return (
    <div className="space-y-6 animate-slide-up">
      {/* Header */}
      <div>
        <h1 className="font-sans font-bold text-2xl text-white">Dashboard</h1>
        <p className="text-slate-400 text-sm mt-1">Sizning o'qish progressingiz</p>
      </div>

      {/* Readiness + Stats top row */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
        {/* Readiness Score */}
        <div className="card col-span-1 flex flex-col items-center justify-center py-4 border-accent-200/30">
          <div className="text-xs text-slate-400 uppercase tracking-widest mb-3">Interview Readiness</div>
          <ScoreRing score={s.readinessScore} size={100} />
          <div className={`text-xs font-semibold mt-1 ${
            s.readinessScore >= 70 ? 'text-emerald-400' :
            s.readinessScore >= 40 ? 'text-amber-400' : 'text-rose-400'
          }`}>
            {s.readinessScore >= 70 ? '🟢 Tayyor' : s.readinessScore >= 40 ? '🟡 O\'rta' : '🔴 Tayyorgarlik kerak'}
          </div>
        </div>

        {/* Stat cards */}
        {statCards.slice(0, 3).map((c) => (
          <div key={c.label} className="stat-card">
            <div className="flex items-start justify-between mb-3">
              <div className={`p-2 rounded-lg ${c.bg}`}>
                <c.icon size={18} className={c.color} />
              </div>
            </div>
            <div className="font-sans font-bold text-2xl text-white mb-0.5">{c.value}</div>
            <div className="text-xs text-slate-400">{c.label}</div>
          </div>
        ))}
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Weekly Activity */}
        <div className="card">
          <h3 className="font-semibold text-white mb-4 text-sm">Haftalik faollik</h3>
          <ResponsiveContainer width="100%" height={180}>
            <BarChart data={s.weeklyActivity} barSize={20}>
              <XAxis dataKey="day" tick={{ fill: '#64748b', fontSize: 11 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: '#64748b', fontSize: 11 }} axisLine={false} tickLine={false} domain={[0, 100]} />
              <Tooltip
                contentStyle={{ background: '#0f1628', border: '1px solid #1e2d4a', borderRadius: 8, fontSize: 12 }}
                labelStyle={{ color: '#94a3b8' }}
                itemStyle={{ color: '#00d4ff' }}
                formatter={(v: number) => [`${v}%`, 'Ball']}
              />
              <Bar dataKey="score" fill="#00d4ff" radius={[4, 4, 0, 0]} fillOpacity={0.8} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Score Trend */}
        <div className="card">
          <h3 className="font-semibold text-white mb-4 text-sm">Ball dinamikasi</h3>
          <ResponsiveContainer width="100%" height={180}>
            <AreaChart data={s.weeklyActivity}>
              <defs>
                <linearGradient id="scoreGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#00d4ff" stopOpacity={0.15} />
                  <stop offset="95%" stopColor="#00d4ff" stopOpacity={0} />
                </linearGradient>
              </defs>
              <XAxis dataKey="day" tick={{ fill: '#64748b', fontSize: 11 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: '#64748b', fontSize: 11 }} axisLine={false} tickLine={false} domain={[0, 100]} />
              <Tooltip
                contentStyle={{ background: '#0f1628', border: '1px solid #1e2d4a', borderRadius: 8, fontSize: 12 }}
                formatter={(v: number) => [`${v}%`, 'Ball']}
              />
              <Area type="monotone" dataKey="score" stroke="#00d4ff" strokeWidth={2} fill="url(#scoreGrad)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Bottom stats grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {statCards.slice(4).map((c) => (
          <div key={c.label} className="stat-card">
            <div className={`p-2 rounded-lg ${c.bg} w-fit mb-3`}>
              <c.icon size={16} className={c.color} />
            </div>
            <div className="font-sans font-bold text-xl text-white mb-0.5">{c.value}</div>
            <div className="text-xs text-slate-400">{c.label}</div>
          </div>
        ))}
      </div>
    </div>
  )
}
