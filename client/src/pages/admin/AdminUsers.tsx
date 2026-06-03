import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { Trash2, Search } from 'lucide-react'
import api from '../../api/axios'
import { PageLoader } from '../../components/ui'

export default function AdminUsers() {
  const qc = useQueryClient()
  const [search, setSearch] = useState('')
  const [page, setPage] = useState(1)
  const { data, isLoading } = useQuery({
    queryKey: ['admin-users', search, page],
    queryFn: () => api.get('/admin/users', { params: { search, page, limit: 20 } }).then((r) => r.data),
  })
  const deleteMutation = useMutation({
    mutationFn: (id: string) => api.delete(`/admin/users/${id}`),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['admin-users'] }),
  })
  const users = data?.data || []
  return (
    <div className="space-y-4">
      <h1 className="font-sans font-bold text-2xl text-white">Foydalanuvchilar</h1>
      <div className="relative">
        <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
        <input className="input pl-9" placeholder="Qidirish..." value={search} onChange={(e) => { setSearch(e.target.value); setPage(1) }} />
      </div>
      {isLoading ? <PageLoader /> : (
        <div className="card overflow-x-auto">
          <table className="w-full text-sm">
            <thead><tr className="text-xs text-slate-500 uppercase border-b border-slate-800">
              <th className="text-left py-3 px-2">Ism</th>
              <th className="text-left py-3 px-2">Email</th>
              <th className="text-left py-3 px-2">Role</th>
              <th className="text-left py-3 px-2">Quizlar</th>
              <th className="text-left py-3 px-2">Sana</th>
              <th className="py-3 px-2"></th>
            </tr></thead>
            <tbody>
              {users.map((u: any) => (
                <tr key={u.id} className="border-b border-slate-800/40 hover:bg-slate-800/30">
                  <td className="py-2 px-2 text-white font-medium">{u.fullName}</td>
                  <td className="py-2 px-2 text-slate-400">{u.email}</td>
                  <td className="py-2 px-2">
                    <span className={`text-xs px-2 py-0.5 rounded ${u.role === 'ADMIN' ? 'bg-rose-500/10 text-rose-400' : 'bg-slate-700 text-slate-400'}`}>{u.role}</span>
                  </td>
                  <td className="py-2 px-2 text-slate-400">{u._count?.quizResults}</td>
                  <td className="py-2 px-2 text-slate-500">{new Date(u.createdAt).toLocaleDateString()}</td>
                  <td className="py-2 px-2">
                    {u.role !== 'ADMIN' && (
                      <button onClick={() => { if(confirm("O'chirasizmi?")) deleteMutation.mutate(u.id) }} className="p-1.5 text-slate-600 hover:text-rose-400">
                        <Trash2 size={14} />
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
