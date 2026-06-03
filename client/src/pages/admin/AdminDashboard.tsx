import { useQuery } from '@tanstack/react-query'
import api from '../../api/axios'
import { PageLoader } from '../../components/ui'

export default function AdminDashboard() {
  const { data, isLoading } = useQuery({
    queryKey: ['admin-analytics'],
    queryFn: () => api.get('/admin/analytics').then((r) => r.data.data),
  })
  if (isLoading) return <PageLoader />
  const s = data || {}
  const cards = [
    { label: 'Foydalanuvchilar', value: s.totalUsers, icon: '👥' },
    { label: 'Savollar', value: s.totalQuestions, icon: '❓' },
    { label: 'Quizlar', value: s.totalQuizzes, icon: '📋' },
    { label: 'Jami urinishlar', value: s.totalResults, icon: '🏆' },
    { label: "O'rtacha ball", value: `${s.avgScore}%`, icon: '📊' },
  ]
  return (
    <div className="space-y-6">
      <h1 className="font-sans font-bold text-2xl text-white">Analytics</h1>
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        {cards.map((c) => (
          <div key={c.label} className="card text-center">
            <div className="text-3xl mb-2">{c.icon}</div>
            <div className="font-bold text-xl text-white">{c.value}</div>
            <div className="text-xs text-slate-400">{c.label}</div>
          </div>
        ))}
      </div>
      {s.recentUsers && (
        <div className="card">
          <h3 className="font-semibold text-white mb-3 text-sm">So'nggi foydalanuvchilar</h3>
          <table className="w-full text-sm">
            <thead><tr className="text-xs text-slate-500 uppercase border-b border-slate-800">
              <th className="text-left py-2">Ism</th><th className="text-left py-2">Email</th><th className="text-left py-2">Sana</th>
            </tr></thead>
            <tbody>
              {s.recentUsers.map((u: any) => (
                <tr key={u.id} className="border-b border-slate-800/50">
                  <td className="py-2 text-white">{u.fullName}</td>
                  <td className="py-2 text-slate-400">{u.email}</td>
                  <td className="py-2 text-slate-500">{new Date(u.createdAt).toLocaleDateString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
