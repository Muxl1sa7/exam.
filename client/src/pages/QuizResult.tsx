import { useParams, useNavigate } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { CheckCircle, XCircle, Clock, RotateCcw, Home } from 'lucide-react'
import { quizApi } from '../api/quiz.api'
import { PageLoader, ScoreRing } from '../components/ui'
import type { QuizResult as IResult } from '../types'

export default function QuizResult() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()

  const { data: result, isLoading } = useQuery({
    queryKey: ['quiz-result', id],
    queryFn: () => quizApi.getResult(id!).then((r) => r.data.data as IResult),
  })

  if (isLoading) return <PageLoader />
  if (!result) return null

  const pct = Math.round(result.percentage)
  const msg = pct >= 80 ? { text: "Ajoyib natija! 🎉", color: 'text-emerald-400' }
    : pct >= 60 ? { text: "Yaxshi natija! 👍", color: 'text-amber-400' }
    : { text: "Ko'proq mashq kerak 💪", color: 'text-rose-400' }

  return (
    <div className="max-w-3xl mx-auto animate-slide-up space-y-6">
      {/* Score card */}
      <div className="card text-center py-8">
        <ScoreRing score={pct} size={120} label="Ball" />
        <h2 className={`font-sans font-bold text-2xl mt-4 mb-1 ${msg.color}`}>{msg.text}</h2>
        <p className="text-slate-400 text-sm">{result.quiz?.title}</p>
        <div className="flex items-center justify-center gap-8 mt-6 pt-6 border-t border-slate-800">
          <div className="text-center">
            <div className="font-bold text-xl text-emerald-400">{result.score}</div>
            <div className="text-xs text-slate-400">To'g'ri</div>
          </div>
          <div className="text-center">
            <div className="font-bold text-xl text-rose-400">{result.total - result.score}</div>
            <div className="text-xs text-slate-400">Noto'g'ri</div>
          </div>
          <div className="text-center">
            <div className="font-bold text-xl text-slate-300 flex items-center gap-1">
              <Clock size={16} />{Math.round(result.timeSpent / 60)}m
            </div>
            <div className="text-xs text-slate-400">Vaqt</div>
          </div>
        </div>
        <div className="flex items-center justify-center gap-3 mt-6">
          <button onClick={() => navigate('/quizzes')} className="btn-secondary flex items-center gap-2">
            <RotateCcw size={14} /> Qayta topshirish
          </button>
          <button onClick={() => navigate('/dashboard')} className="btn-ghost flex items-center gap-2">
            <Home size={14} /> Dashboard
          </button>
        </div>
      </div>

      {/* Answer review */}
      <div>
        <h3 className="font-semibold text-white mb-3 text-sm">Javoblar tahlili</h3>
        <div className="space-y-3">
          {result.answers.map((ans, i) => (
            <div key={ans.questionId}
              className={`card p-4 border ${ans.isCorrect ? 'border-emerald-500/20' : 'border-rose-500/20'}`}
            >
              <div className="flex items-start gap-3">
                <div className="mt-0.5 shrink-0">
                  {ans.isCorrect
                    ? <CheckCircle size={16} className="text-emerald-400" />
                    : <XCircle size={16} className="text-rose-400" />}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-slate-200 mb-2">{i + 1}. {ans.questionTitle}</p>
                  {!ans.isCorrect && ans.correctAnswer && (
                    <div className="text-xs bg-emerald-500/10 border border-emerald-500/20 rounded-lg p-2 text-emerald-300 mb-2">
                      ✓ To'g'ri javob: {ans.correctAnswer}
                    </div>
                  )}
                  {ans.explanation && (
                    <p className="text-xs text-slate-400 leading-relaxed">{ans.explanation}</p>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
