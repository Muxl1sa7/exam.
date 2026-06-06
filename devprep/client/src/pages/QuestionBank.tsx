import { useState, useEffect } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { Search, BookmarkPlus, Bookmark, ChevronRight, Filter } from 'lucide-react'
import { questionsApi } from '../api/questions.api'
import { Badge, PageLoader, EmptyState, Modal } from '../components/ui'
import type { Question, Category } from '../types'

const difficultyLabel: Record<string, string> = { EASY: 'Oson', MEDIUM: "O'rta", HARD: 'Qiyin' }
const groupLabel: Record<string, string> = { FRONTEND: 'Frontend', BACKEND: 'Backend', GENERAL: 'General' }

export default function QuestionBank() {
  const qc = useQueryClient()
  const [search, setSearch] = useState('')
  const [debouncedSearch, setDebouncedSearch] = useState('')
  const [categoryId, setCategoryId] = useState('')
  const [difficulty, setDifficulty] = useState('')
  const [page, setPage] = useState(1)
  const [selected, setSelected] = useState<Question | null>(null)

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedSearch(search), 400)
    return () => clearTimeout(timer)
  }, [search])

  const params: Record<string, string | number> = { page, limit: 15 }
  if (debouncedSearch) params.search = debouncedSearch
  if (categoryId) params.categoryId = categoryId
  if (difficulty) params.difficulty = difficulty

  const { data: questionsData, isLoading } = useQuery({
    queryKey: ['questions', params],
    queryFn: () => questionsApi.getQuestions(params).then((r) => r.data),
  })

  const { data: categoriesData } = useQuery({
    queryKey: ['categories'],
    queryFn: () => questionsApi.getCategories().then((r) => r.data.data as Category[]),
  })

  const bookmarkMutation = useMutation({
    mutationFn: (id: string) => questionsApi.toggleBookmark(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['questions'] }),
  })

  const questions: Question[] = questionsData?.data || []
  const pagination = questionsData?.pagination
  const categories: Category[] = categoriesData || []

  const grouped = categories.reduce<Record<string, Category[]>>((acc, c) => {
    if (!acc[c.group]) acc[c.group] = []
    acc[c.group].push(c)
    return acc
  }, {})

  return (
    <div className="flex gap-6 animate-slide-up">
      {/* Sidebar */}
      <aside className="w-56 shrink-0 space-y-2">
        <div className="card p-4">
          <h3 className="text-xs uppercase tracking-widest text-slate-400 mb-3">Kategoriyalar</h3>
          <button
            onClick={() => { setCategoryId(''); setPage(1) }}
            className={`w-full text-left text-sm px-2 py-1.5 rounded-lg transition-colors mb-1 ${!categoryId ? 'text-accent-500 bg-accent-50' : 'text-slate-400 hover:text-white hover:bg-slate-800'}`}
          >
            Barcha savollar
          </button>
          {Object.entries(grouped).map(([group, cats]) => (
            <div key={group} className="mb-3">
              <div className="text-xs text-slate-600 uppercase tracking-wider px-2 mb-1">{groupLabel[group]}</div>
              {cats.map((c) => (
                <button key={c.id}
                  onClick={() => { setCategoryId(c.id); setPage(1) }}
                  className={`w-full text-left text-sm px-2 py-1.5 rounded-lg transition-colors ${categoryId === c.id ? 'text-accent-500 bg-accent-50' : 'text-slate-400 hover:text-white hover:bg-slate-800'}`}
                >
                  <span className="flex items-center justify-between">
                    <span>{c.name}</span>
                    <span className="text-xs text-slate-600">{c.questionCount}</span>
                  </span>
                </button>
              ))}
            </div>
          ))}
        </div>

        <div className="card p-4">
          <h3 className="text-xs uppercase tracking-widest text-slate-400 mb-3">Qiyinlik</h3>
          {['', 'EASY', 'MEDIUM', 'HARD'].map((d) => (
            <button key={d}
              onClick={() => { setDifficulty(d); setPage(1) }}
              className={`w-full text-left text-sm px-2 py-1.5 rounded-lg transition-colors mb-0.5 ${difficulty === d ? 'text-accent-500 bg-accent-50' : 'text-slate-400 hover:text-white hover:bg-slate-800'}`}
            >
              {d ? difficultyLabel[d] : 'Barchasi'}
            </button>
          ))}
        </div>
      </aside>

      {/* Main */}
      <div className="flex-1 min-w-0">
        {/* Search */}
        <div className="relative mb-4">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
          <input
            className="input pl-9"
            placeholder="Savol qidirish..."
            value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(1) }}
          />
        </div>

        {/* Stats bar */}
        <div className="flex items-center gap-3 mb-4 text-xs text-slate-400">
          <Filter size={13} />
          <span>{pagination?.total || 0} ta savol topildi</span>
          {(categoryId || difficulty || search) && (
            <button onClick={() => { setCategoryId(''); setDifficulty(''); setSearch(''); setDebouncedSearch(''); setPage(1) }}
              className="text-accent-500 hover:underline">Filtrlarni tozalash</button>
          )}
        </div>

        {isLoading ? (
          <PageLoader />
        ) : questions.length === 0 ? (
          <EmptyState icon="🔍" title="Savollar topilmadi" desc="Boshqa kalit so'z yoki filtr bilan urinib ko'ring" />
        ) : (
          <div className="space-y-2">
            {questions.map((q) => (
              <div key={q.id}
                className="card p-4 hover:border-slate-700 cursor-pointer transition-all group flex items-start gap-4"
                onClick={() => setSelected(q)}
              >
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1.5 flex-wrap">
                    <Badge variant={q.difficulty.toLowerCase() as any}>{difficultyLabel[q.difficulty]}</Badge>
                    <Badge variant={q.category.group.toLowerCase() as any}>{q.category.name}</Badge>
                    <span className="text-xs text-slate-500">{q.type === 'OPEN_ENDED' ? '✍️ Ochiq' : '📋 Test'}</span>
                  </div>
                  <p className="text-sm text-slate-200 group-hover:text-white transition-colors line-clamp-2">
                    {q.title}
                  </p>
                  {q.tags.length > 0 && (
                    <div className="flex gap-1.5 mt-2 flex-wrap">
                      {q.tags.slice(0, 3).map((t) => (
                        <span key={t} className="text-xs text-slate-500 bg-slate-800 px-2 py-0.5 rounded">#{t}</span>
                      ))}
                    </div>
                  )}
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <button
                    onClick={(e) => { e.stopPropagation(); bookmarkMutation.mutate(q.id) }}
                    className={`p-1.5 rounded-lg transition-colors ${q.isBookmarked ? 'text-accent-500 bg-accent-50' : 'text-slate-600 hover:text-accent-500 hover:bg-accent-50'}`}
                  >
                    {q.isBookmarked ? <Bookmark size={15} fill="currentColor" /> : <BookmarkPlus size={15} />}
                  </button>
                  <ChevronRight size={15} className="text-slate-600 group-hover:text-slate-400 transition-colors" />
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Pagination */}
        {pagination && pagination.totalPages > 1 && (
          <div className="flex items-center justify-center gap-2 mt-6">
            <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1} className="btn-secondary text-xs px-3 py-1.5 disabled:opacity-40">← Oldingi</button>
            <span className="text-xs text-slate-400">{page} / {pagination.totalPages}</span>
            <button onClick={() => setPage(p => Math.min(pagination.totalPages, p + 1))} disabled={page === pagination.totalPages} className="btn-secondary text-xs px-3 py-1.5 disabled:opacity-40">Keyingi →</button>
          </div>
        )}
      </div>

      {/* Question Detail Modal */}
      <Modal isOpen={!!selected} onClose={() => setSelected(null)} title="Savol tafsiloti">
        {selected && (
          <div className="space-y-4">
            <div className="flex gap-2 flex-wrap">
              <Badge variant={selected.difficulty.toLowerCase() as any}>{difficultyLabel[selected.difficulty]}</Badge>
              <Badge variant={selected.category.group.toLowerCase() as any}>{selected.category.name}</Badge>
            </div>
            <p className="text-slate-200 text-sm leading-relaxed font-semibold">{selected.title}</p>
            {selected.options && (
              <div className="space-y-2">
                {selected.options.map((o) => (
                  <div key={o.id} className={`p-3 rounded-lg text-sm border ${o.isCorrect ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300' : 'bg-slate-800/50 border-slate-700 text-slate-400'}`}>
                    {o.isCorrect && '✓ '}{o.text}
                  </div>
                ))}
              </div>
            )}
            {selected.correctAnswer && (
              <div className="p-3 rounded-lg bg-emerald-500/10 border border-emerald-500/20">
                <div className="text-xs text-emerald-400 uppercase tracking-wider mb-1">To'g'ri javob</div>
                <p className="text-sm text-emerald-300">{selected.correctAnswer}</p>
              </div>
            )}
            {selected.explanation && (
              <div className="p-3 rounded-lg bg-slate-800 border border-slate-700">
                <div className="text-xs text-slate-400 uppercase tracking-wider mb-1">Tushuntirish</div>
                <p className="text-sm text-slate-300 leading-relaxed">{selected.explanation}</p>
              </div>
            )}
          </div>
        )}
      </Modal>
    </div>
  )
}
