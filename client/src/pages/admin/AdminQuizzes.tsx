import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { Plus, Trash2 } from 'lucide-react'
import api from '../../api/axios'
import { PageLoader, Modal, Badge } from '../../components/ui'

const emptyForm = { title: '', description: '', type: 'FRONTEND', difficulty: 'EASY', timeLimit: 600, questionIds: '' }
const typeLabel: Record<string, string> = { FRONTEND: 'Frontend', BACKEND: 'Backend', FULLSTACK: 'Full Stack' }

export default function AdminQuizzes() {
  const qc = useQueryClient()
  const [showModal, setShowModal] = useState(false)
  const [form, setForm] = useState(emptyForm)
  const { data: quizzes, isLoading } = useQuery({
    queryKey: ['admin-quizzes'],
    queryFn: () => api.get('/quizzes', { params: { limit: 50 } }).then((r) => r.data.data),
  })
  const createMutation = useMutation({
    mutationFn: () => api.post('/admin/quizzes', { ...form, timeLimit: Number(form.timeLimit), questionIds: form.questionIds.split(',').map((s: string) => s.trim()).filter(Boolean) }),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['admin-quizzes'] }); setShowModal(false); setForm(emptyForm) },
  })
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="font-sans font-bold text-2xl text-white">Quizlar</h1>
        <button onClick={() => setShowModal(true)} className="btn-primary flex items-center gap-2"><Plus size={15} /> Quiz qo'shish</button>
      </div>
      {isLoading ? <PageLoader /> : (
        <div className="space-y-2">
          {(quizzes || []).map((q: any) => (
            <div key={q.id} className="card flex items-center gap-3">
              <div className="flex-1">
                <div className="flex gap-2 mb-1">
                  <Badge variant={q.type.toLowerCase()}>{typeLabel[q.type]}</Badge>
                  <Badge variant={q.difficulty.toLowerCase()}>{q.difficulty}</Badge>
                </div>
                <p className="text-sm text-white">{q.title}</p>
                <p className="text-xs text-slate-500">{q.questionCount} savol · {Math.round(q.timeLimit/60)} daqiqa</p>
              </div>
            </div>
          ))}
        </div>
      )}
      <Modal isOpen={showModal} onClose={() => setShowModal(false)} title="Yangi quiz">
        <div className="space-y-3">
          <div><label className="text-xs text-slate-400 mb-1 block">Sarlavha</label><input className="input" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} /></div>
          <div><label className="text-xs text-slate-400 mb-1 block">Tavsif</label><textarea className="input" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} /></div>
          <div className="grid grid-cols-3 gap-3">
            <div><label className="text-xs text-slate-400 mb-1 block">Yo'nalish</label>
              <select className="input" value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value })}>
                <option value="FRONTEND">Frontend</option><option value="BACKEND">Backend</option><option value="FULLSTACK">Full Stack</option>
              </select>
            </div>
            <div><label className="text-xs text-slate-400 mb-1 block">Qiyinlik</label>
              <select className="input" value={form.difficulty} onChange={(e) => setForm({ ...form, difficulty: e.target.value })}>
                <option value="EASY">Oson</option><option value="MEDIUM">O'rta</option><option value="HARD">Qiyin</option><option value="MIXED">Aralash</option>
              </select>
            </div>
            <div><label className="text-xs text-slate-400 mb-1 block">Vaqt (soniya)</label><input type="number" className="input" value={form.timeLimit} onChange={(e) => setForm({ ...form, timeLimit: Number(e.target.value) })} /></div>
          </div>
          <div><label className="text-xs text-slate-400 mb-1 block">Savol ID-lari (vergul bilan)</label><textarea className="input" value={form.questionIds} onChange={(e) => setForm({ ...form, questionIds: e.target.value })} placeholder="uuid1, uuid2" /></div>
          <button onClick={() => createMutation.mutate()} disabled={!form.title || createMutation.isPending} className="btn-primary w-full">{createMutation.isPending ? 'Saqlanmoqda...' : 'Saqlash'}</button>
        </div>
      </Modal>
    </div>
  )
}
