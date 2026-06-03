import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { useNavigate } from 'react-router-dom'
import { Clock, Users, ChevronRight, Filter } from 'lucide-react'
import { quizApi } from '../api/quiz.api'
import { Badge, PageLoader, EmptyState } from '../components/ui'
import type { Quiz } from '../types'

const diffLabel: Record<string, string> = { EASY: 'Oson', MEDIUM: "O'rta", HARD: 'Qiyin', MIXED: 'Aralash' }
const typeLabel: Record<string, string> = { FRONTEND: 'Frontend', BACKEND: 'Backend', FULLSTACK: 'Full Stack' }

export default function QuizList() {
  const navigate = useNavigate()
  const [typeFilter, setTypeFilter] = useState('')
  const [diffFilter, setDiffFilter] = useState('')

  const params: Record<string, string> = {}
  if (typeFilter) params.type = typeFilter
  if (diffFilter) params.difficulty = diffFilter

  const { data, isLoading } = useQuery({
    queryKey: ['quizzes', params],
    queryFn: () => quizApi.getQuizzes(params).then((r) => r.data.data as Quiz[]),
  })

  return (
    <div className="animate-slide-up space-y-6">
      <div>
        <h1 className="font-sans font-bold text-2xl text-white">Quizlar</h1>
        <p className="text-slate-400 text-sm mt-1">Bilimingizni sinab ko'ring</p>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-3">
        <div className="flex items-center gap-2">
          <Filter size={14} className="text-slate-500" />
          {['', 'FRONTEND', 'BACKEND', 'FULLSTACK'].map((t) => (
            <button key={t} onClick={() => setTypeFilter(t)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all ${
                typeFilter === t ? 'bg-accent-100 border-accent-200 text-accent-500' : 'bg-slate-800 border-slate-700 text-slate-400 hover:border-slate-600'
              }`}
            >
              {t ? typeLabel[t] : 'Barchasi'}
            </button>
          ))}
        </div>
        <div className="flex items-center gap-2">
          {['', 'EASY', 'MEDIUM', 'HARD'].map((d) => (
            <button key={d} onClick={() => setDiffFilter(d)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all ${
                diffFilter === d ? 'bg-accent-100 border-accent-200 text-accent-500' : 'bg-slate-800 border-slate-700 text-slate-400 hover:border-slate-600'
              }`}
            >
              {d ? diffLabel[d] : "Qiyinlik (barchasi)"}
            </button>
          ))}
        </div>
      </div>

      {isLoading ? <PageLoader /> : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {(data || []).length === 0 ? (
            <div className="col-span-3"><EmptyState icon="📋" title="Quiz topilmadi" /></div>
          ) : (data || []).map((quiz) => (
            <div key={quiz.id}
              className="card hover:border-slate-700 cursor-pointer group transition-all hover:glow"
              onClick={() => navigate(`/quizzes/${quiz.id}/session`)}
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex gap-2 flex-wrap">
                  <Badge variant={quiz.type.toLowerCase() as any}>{typeLabel[quiz.type]}</Badge>
                  <Badge variant={quiz.difficulty.toLowerCase() as any}>{diffLabel[quiz.difficulty]}</Badge>
                </div>
                <ChevronRight size={16} className="text-slate-600 group-hover:text-accent-500 transition-colors mt-0.5" />
              </div>
              <h3 className="font-semibold text-white mb-1 group-hover:text-accent-500 transition-colors">{quiz.title}</h3>
              {quiz.description && <p className="text-xs text-slate-400 mb-4 line-clamp-2">{quiz.description}</p>}
              <div className="flex items-center gap-4 text-xs text-slate-500 pt-3 border-t border-slate-800">
                <span className="flex items-center gap-1">
                  <span>📝</span> {quiz.questionCount} savol
                </span>
                <span className="flex items-center gap-1">
                  <Clock size={12} /> {Math.round(quiz.timeLimit / 60)} daqiqa
                </span>
                {quiz._count && (
                  <span className="flex items-center gap-1">
                    <Users size={12} /> {quiz._count.results} urinish
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
