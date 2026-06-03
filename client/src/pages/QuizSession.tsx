import { useState, useEffect, useCallback } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useQuery, useMutation } from '@tanstack/react-query'
import { Clock, ChevronLeft, ChevronRight, Send, AlertCircle } from 'lucide-react'
import { quizApi } from '../api/quiz.api'
import { PageLoader, Badge, Spinner } from '../components/ui'
import type { QuizSession as IQuizSession } from '../types'

export default function QuizSession() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const [started, setStarted] = useState(false)
  const [session, setSession] = useState<IQuizSession | null>(null)
  const [current, setCurrent] = useState(0)
  const [answers, setAnswers] = useState<Record<string, string>>({})
  const [timeLeft, setTimeLeft] = useState(0)
  const [startTime] = useState(Date.now())

  const { data: quizMeta, isLoading } = useQuery({
    queryKey: ['quiz', id],
    queryFn: () => quizApi.getQuiz(id!).then((r) => r.data.data),
  })

  const startMutation = useMutation({
    mutationFn: () => quizApi.startQuiz(id!).then((r) => r.data.data as IQuizSession),
    onSuccess: (data) => {
      setSession(data)
      setTimeLeft(data.timeLimit)
      setStarted(true)
    },
  })

  const submitMutation = useMutation({
    mutationFn: () => {
      const timeSpent = Math.round((Date.now() - startTime) / 1000)
      const answersList = session!.questions.map((q) => ({
        questionId: q.id,
        selectedOptionId: answers[q.id],
      }))
      return quizApi.submitQuiz(id!, { answers: answersList, timeSpent }).then((r) => r.data.data)
    },
    onSuccess: (data) => navigate(`/quizzes/results/${data.id}`),
  })

  // Timer
  useEffect(() => {
    if (!started || timeLeft <= 0) return
    const interval = setInterval(() => {
      setTimeLeft((t) => {
        if (t <= 1) { clearInterval(interval); submitMutation.mutate(); return 0 }
        return t - 1
      })
    }, 1000)
    return () => clearInterval(interval)
  }, [started])

  const formatTime = (s: number) => `${String(Math.floor(s / 60)).padStart(2, '0')}:${String(s % 60).padStart(2, '0')}`

  if (isLoading) return <PageLoader />

  // Pre-start screen
  if (!started && quizMeta) {
    return (
      <div className="max-w-lg mx-auto mt-12 card animate-slide-up">
        <div className="text-center mb-8">
          <div className="text-5xl mb-4">📋</div>
          <h2 className="font-sans font-bold text-2xl text-white mb-2">{quizMeta.title}</h2>
          <p className="text-slate-400 text-sm">{quizMeta.description}</p>
        </div>
        <div className="grid grid-cols-3 gap-4 mb-8">
          {[
            { label: 'Savollar', value: quizMeta.questionCount },
            { label: 'Vaqt', value: `${Math.round(quizMeta.timeLimit / 60)} daqiqa` },
            { label: "Qiyinlik", value: quizMeta.difficulty },
          ].map((item) => (
            <div key={item.label} className="text-center p-3 rounded-xl bg-slate-800 border border-slate-700">
              <div className="font-bold text-white text-lg">{item.value}</div>
              <div className="text-xs text-slate-400">{item.label}</div>
            </div>
          ))}
        </div>
        <button onClick={() => startMutation.mutate()} disabled={startMutation.isPending}
          className="btn-primary w-full flex items-center justify-center gap-2">
          {startMutation.isPending ? <Spinner size={16} /> : null}
          Quizni boshlash
        </button>
      </div>
    )
  }

  if (!session) return <PageLoader />
  const question = session.questions[current]
  const answered = Object.keys(answers).length
  const isLast = current === session.questions.length - 1

  return (
    <div className="max-w-3xl mx-auto animate-slide-up">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="text-sm text-slate-400">
          <span className="text-white font-semibold">{current + 1}</span> / {session.questions.length}
        </div>
        <div className={`flex items-center gap-2 px-4 py-2 rounded-xl font-mono font-bold text-lg border ${
          timeLeft < 60 ? 'bg-rose-500/10 border-rose-500/20 text-rose-400' :
          timeLeft < 180 ? 'bg-amber-500/10 border-amber-500/20 text-amber-400' :
          'bg-accent-100 border-accent-200 text-accent-500'
        }`}>
          <Clock size={18} />
          {formatTime(timeLeft)}
        </div>
        <div className="text-xs text-slate-400">{answered} javob berildi</div>
      </div>

      {/* Progress bar */}
      <div className="h-1.5 bg-slate-800 rounded-full mb-6 overflow-hidden">
        <div className="h-full bg-accent-500 rounded-full transition-all duration-300"
          style={{ width: `${((current + 1) / session.questions.length) * 100}%` }} />
      </div>

      {/* Question */}
      <div className="card mb-4">
        <div className="flex items-center gap-2 mb-4">
          <Badge variant={question.difficulty.toLowerCase() as any}>
            {question.difficulty === 'EASY' ? 'Oson' : question.difficulty === 'MEDIUM' ? "O'rta" : 'Qiyin'}
          </Badge>
          {question.category && <span className="text-xs text-slate-500">{question.category.name}</span>}
        </div>
        <p className="text-slate-100 text-base leading-relaxed font-semibold">{question.title}</p>
      </div>

      {/* Options */}
      {question.options && (
        <div className="space-y-2 mb-6">
          {question.options.map((opt) => (
            <button key={opt.id}
              onClick={() => setAnswers({ ...answers, [question.id]: opt.id })}
              className={`w-full p-4 rounded-xl text-left text-sm border transition-all ${
                answers[question.id] === opt.id
                  ? 'bg-accent-100 border-accent-200 text-accent-500 font-semibold'
                  : 'bg-slate-800/50 border-slate-700 text-slate-300 hover:border-slate-600 hover:bg-slate-800'
              }`}
            >
              <span className="mr-3 inline-flex w-6 h-6 items-center justify-center rounded-full bg-slate-700 text-xs font-bold">
                {String.fromCharCode(65 + question.options!.indexOf(opt))}
              </span>
              {opt.text}
            </button>
          ))}
        </div>
      )}

      {/* Navigation */}
      <div className="flex items-center justify-between">
        <button onClick={() => setCurrent((c) => Math.max(0, c - 1))} disabled={current === 0}
          className="btn-secondary flex items-center gap-1.5 disabled:opacity-40">
          <ChevronLeft size={15} /> Oldingi
        </button>

        {/* Question dots */}
        <div className="flex gap-1.5 flex-wrap justify-center max-w-xs">
          {session.questions.map((q, i) => (
            <button key={q.id} onClick={() => setCurrent(i)}
              className={`w-7 h-7 rounded-lg text-xs font-bold transition-all ${
                i === current ? 'bg-accent-500 text-dark-900' :
                answers[q.id] ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' :
                'bg-slate-800 text-slate-500 hover:bg-slate-700'
              }`}
            >{i + 1}</button>
          ))}
        </div>

        {isLast ? (
          <button onClick={() => submitMutation.mutate()} disabled={submitMutation.isPending}
            className="btn-primary flex items-center gap-1.5">
            {submitMutation.isPending ? <Spinner size={14} /> : <Send size={14} />}
            Yuborish
          </button>
        ) : (
          <button onClick={() => setCurrent((c) => Math.min(session.questions.length - 1, c + 1))}
            className="btn-secondary flex items-center gap-1.5">
            Keyingi <ChevronRight size={15} />
          </button>
        )}
      </div>

      {/* Unanswered warning */}
      {isLast && answered < session.questions.length && (
        <div className="mt-4 flex items-center gap-2 text-xs text-amber-400 bg-amber-500/10 border border-amber-500/20 rounded-lg p-3">
          <AlertCircle size={14} />
          {session.questions.length - answered} ta savol javobsiz qoldi. Baribir yubormoqchimisiz?
        </div>
      )}
    </div>
  )
}
