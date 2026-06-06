import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { Plus, Trash2, Pencil } from 'lucide-react'
import api from '../../api/axios'
import { questionsApi } from '../../api/questions.api'
import { PageLoader, Modal, Badge } from '../../components/ui'

const diffLabel: Record<string, string> = { EASY: 'Oson', MEDIUM: "O'rta", HARD: 'Qiyin' }
const emptyForm = { title: '', categoryId: '', type: 'SINGLE_CHOICE', difficulty: 'EASY', correctAnswer: '', explanation: '', tags: '' }

export default function AdminQuestions() {
  const qc = useQueryClient()
  const [showModal, setShowModal] = useState(false)
  const [editId, setEditId] = useState<string | null>(null)
  const [form, setForm] = useState(emptyForm)

  const { data: questions, isLoading } = useQuery({
    queryKey: ['admin-questions'],
    queryFn: () => api.get('/questions', { params: { limit: 50 } }).then((r) => r.data.data),
  })
  const { data: categories } = useQuery({
    queryKey: ['categories'],
    queryFn: () => questionsApi.getCategories().then((r) => r.data.data),
  })

  const createMutation = useMutation({
    mutationFn: () => api.post('/admin/questions', { ...form, tags: form.tags.split(',').map((t: string) => t.trim()).filter(Boolean) }),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['admin-questions'] }); closeModal() },
  })

  const editMutation = useMutation({
    mutationFn: () => api.put(`/admin/questions/${editId}`, { ...form, tags: form.tags.split(',').map((t: string) => t.trim()).filter(Boolean) }),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['admin-questions'] }); closeModal() },
  })

  const deleteMutation = useMutation({
    mutationFn: (id: string) => api.delete(`/admin/questions/${id}`),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['admin-questions'] }),
  })

  function openCreate() {
    setEditId(null)
    setForm(emptyForm)
    setShowModal(true)
  }

  function openEdit(q: any) {
    setEditId(q.id)
    setForm({
      title: q.title || '',
      categoryId: q.categoryId || '',
      type: q.type || 'SINGLE_CHOICE',
      difficulty: q.difficulty || 'EASY',
      correctAnswer: q.correctAnswer || '',
      explanation: q.explanation || '',
      tags: (q.tags || []).join(', '),
    })
    setShowModal(true)
  }

  function closeModal() {
    setShowModal(false)
    setEditId(null)
    setForm(emptyForm)
  }

  function handleSubmit() {
    if (editId) editMutation.mutate()
    else createMutation.mutate()
  }

  const isPending = createMutation.isPending || editMutation.isPending

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="font-sans font-bold text-2xl text-white">Savollar</h1>
        <button onClick={openCreate} className="btn-primary flex items-center gap-2">
          <Plus size={15} /> Savol qo'shish
        </button>
      </div>

      {isLoading ? <PageLoader /> : (
        <div className="space-y-2">
          {(questions || []).map((q: any) => (
            <div key={q.id} className="card flex items-center gap-3">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <Badge variant={q.difficulty.toLowerCase()}>{diffLabel[q.difficulty]}</Badge>
                  <span className="text-xs text-slate-500">{q.category?.name}</span>
                </div>
                <p className="text-sm text-slate-200 truncate">{q.title}</p>
              </div>
              <div className="flex items-center gap-1 shrink-0">
                <button
                  onClick={() => openEdit(q)}
                  className="p-1.5 text-slate-500 hover:text-accent-400 hover:bg-accent-400/10 rounded-lg transition-colors"
                >
                  <Pencil size={14} />
                </button>
                <button
                  onClick={() => { if (confirm("O'chirasizmi?")) deleteMutation.mutate(q.id) }}
                  className="p-1.5 text-slate-500 hover:text-rose-400 hover:bg-rose-400/10 rounded-lg transition-colors"
                >
                  <Trash2 size={14} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      <Modal isOpen={showModal} onClose={closeModal} title={editId ? 'Savolni tahrirlash' : 'Yangi savol'}>
        <div className="space-y-3">
          <div>
            <label className="text-xs text-slate-400 mb-1 block">Kategoriya</label>
            <select className="input" value={form.categoryId} onChange={(e) => setForm({ ...form, categoryId: e.target.value })}>
              <option value="">Tanlang</option>
              {(categories || []).map((c: any) => <option key={c.id} value={c.id}>{c.name}</option>)}
            </select>
          </div>
          <div>
            <label className="text-xs text-slate-400 mb-1 block">Savol matni</label>
            <textarea className="input min-h-[80px]" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs text-slate-400 mb-1 block">Tur</label>
              <select className="input" value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value })}>
                <option value="SINGLE_CHOICE">Bir javob</option>
                <option value="MULTIPLE_CHOICE">Ko'p javob</option>
                <option value="OPEN_ENDED">Ochiq</option>
              </select>
            </div>
            <div>
              <label className="text-xs text-slate-400 mb-1 block">Qiyinlik</label>
              <select className="input" value={form.difficulty} onChange={(e) => setForm({ ...form, difficulty: e.target.value })}>
                <option value="EASY">Oson</option>
                <option value="MEDIUM">O'rta</option>
                <option value="HARD">Qiyin</option>
              </select>
            </div>
          </div>
          <div>
            <label className="text-xs text-slate-400 mb-1 block">To'g'ri javob</label>
            <textarea className="input" value={form.correctAnswer} onChange={(e) => setForm({ ...form, correctAnswer: e.target.value })} />
          </div>
          <div>
            <label className="text-xs text-slate-400 mb-1 block">Tushuntirish</label>
            <textarea className="input" value={form.explanation} onChange={(e) => setForm({ ...form, explanation: e.target.value })} />
          </div>
          <div>
            <label className="text-xs text-slate-400 mb-1 block">Teglar (vergul bilan)</label>
            <input className="input" value={form.tags} onChange={(e) => setForm({ ...form, tags: e.target.value })} placeholder="js, async, promise" />
          </div>
          <button
            onClick={handleSubmit}
            disabled={!form.title || !form.categoryId || isPending}
            className="btn-primary w-full"
          >
            {isPending ? 'Saqlanmoqda...' : editId ? 'Yangilash' : 'Saqlash'}
          </button>
        </div>
      </Modal>
    </div>
  )
}
