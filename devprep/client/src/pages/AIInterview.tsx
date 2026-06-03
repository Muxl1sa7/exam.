import { useState } from 'react'
import { useMutation, useQuery } from '@tanstack/react-query'
import { Bot, Send, Star, Lightbulb, BookOpen, ChevronRight, RefreshCw } from 'lucide-react'
import { aiApi } from '../api/ai.api'
import { PageLoader, Spinner, Badge } from '../components/ui'
import type { AIEvalResult, Question } from '../types'

const tracks = [
  { value: 'FRONTEND', label: '🎨 Frontend', desc: 'HTML, CSS, JS, React' },
  { value: 'BACKEND', label: '⚙️ Backend', desc: 'Node.js, APIs, DB' },
  { value: 'FULLSTACK', label: '🚀 Full Stack', desc: 'Har ikki tomon' },
]

export default function AIInterview() {
  const [track, setTrack] = useState('')
  const [questions, setQuestions] = useState<Question[]>([])
  const [currentIdx, setCurrentIdx] = useState(0)
  const [answer, setAnswer] = useState('')
  const [result, setResult] = useState<AIEvalResult | null>(null)
  const [phase, setPhase] = useState<'select' | 'answer' | 'result'>('select')

  const startMutation = useMutation({
    mutationFn: () => aiApi.startMockInterview(track, 5).then((r) => r.data.data),
    onSuccess: (data) => {
      setQuestions(data)
      setCurrentIdx(0)
      setPhase('answer')
      setAnswer('')
      setResult(null)
    },
  })

  const evaluateMutation = useMutation({
    mutationFn: () => {
      const q = questions[currentIdx]
      return aiApi.evaluate({
        questionText: q.title,
        userAnswer: answer,
        category: q.category?.name,
      }).then((r) => r.data.data as AIEvalResult)
    },
    onSuccess: (data) => {
      setResult(data)
      setPhase('result')
    },
  })

  const nextQuestion = () => {
    if (currentIdx < questions.length - 1) {
      setCurrentIdx((i) => i + 1)
      setAnswer('')
      setResult(null)
      setPhase('answer')
    } else {
      setPhase('select')
      setQuestions([])
    }
  }

  const scoreColor = (s: number) =>
    s >= 8 ? 'text-emerald-400' : s >= 5 ? 'text-amber-400' : 'text-rose-400'

  return (
    <div className="max-w-3xl mx-auto animate-slide-up space-y-6">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-violet-500/20 flex items-center justify-center">
          <Bot size={20} className="text-violet-400" />
        </div>
        <div>
          <h1 className="font-sans font-bold text-2xl text-white">AI Interview</h1>
          <p className="text-slate-400 text-sm">Javoblaringizni Claude AI baholaydi</p>
        </div>
      </div>

      {/* Track Selection */}
      {phase === 'select' && (
        <div className="card space-y-4">
          <h2 className="font-semibold text-white">Yo'nalishni tanlang</h2>
          <div className="grid grid-cols-3 gap-3">
            {tracks.map((t) => (
              <button key={t.value} onClick={() => setTrack(t.value)}
                className={`p-4 rounded-xl border text-left transition-all ${
                  track === t.value
                    ? 'bg-violet-500/10 border-violet-500/30 text-violet-300'
                    : 'bg-slate-800 border-slate-700 text-slate-400 hover:border-slate-600'
                }`}
              >
                <div className="font-semibold mb-1">{t.label}</div>
                <div className="text-xs opacity-70">{t.desc}</div>
              </button>
            ))}
          </div>
          <button onClick={() => startMutation.mutate()} disabled={!track || startMutation.isPending}
            className="btn-primary w-full flex items-center justify-center gap-2">
            {startMutation.isPending ? <Spinner size={16} /> : <Bot size={16} />}
            Intervyuni boshlash
          </button>
        </div>
      )}

      {/* Answer phase */}
      {phase === 'answer' && questions.length > 0 && (
        <div className="space-y-4">
          {/* Progress */}
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>Savol {currentIdx + 1} / {questions.length}</span>
            <div className="flex gap-1">
              {questions.map((_, i) => (
                <div key={i} className={`w-2 h-2 rounded-full ${i === currentIdx ? 'bg-violet-400' : i < currentIdx ? 'bg-emerald-400' : 'bg-slate-700'}`} />
              ))}
            </div>
          </div>

          <div className="card">
            <div className="flex items-center gap-2 mb-3">
              <Badge variant={questions[currentIdx].difficulty.toLowerCase() as any}>
                {questions[currentIdx].difficulty === 'EASY' ? 'Oson' : questions[currentIdx].difficulty === 'MEDIUM' ? "O'rta" : 'Qiyin'}
              </Badge>
              <span className="text-xs text-slate-500">{questions[currentIdx].category?.name}</span>
            </div>
            <p className="text-slate-100 font-semibold leading-relaxed">{questions[currentIdx].title}</p>
          </div>

          <div>
            <label className="text-xs text-slate-400 uppercase tracking-wider mb-2 block">Javobingiz</label>
            <textarea
              value={answer}
              onChange={(e) => setAnswer(e.target.value)}
              placeholder="Bu yerga javobingizni yozing. Imkon qadar to'liq va aniq yozing..."
              className="input min-h-[160px] resize-none"
            />
          </div>

          <button onClick={() => evaluateMutation.mutate()} disabled={!answer.trim() || evaluateMutation.isPending}
            className="btn-primary w-full flex items-center justify-center gap-2">
            {evaluateMutation.isPending ? (
              <>
                <Spinner size={16} />
                AI baholayapti...
              </>
            ) : (
              <>
                <Send size={16} />
                AI baholash
              </>
            )}
          </button>
        </div>
      )}

      {/* Result phase */}
      {phase === 'result' && result && (
        <div className="space-y-4 animate-slide-up">
          {/* Score */}
          <div className="card flex items-center gap-6">
            <div className="text-center">
              <div className={`font-sans font-bold text-5xl ${scoreColor(result.score)}`}>{result.score}</div>
              <div className="text-xs text-slate-400 mt-1">/ 10</div>
            </div>
            <div className="flex-1">
              <div className="flex gap-1 mb-2">
                {[1,2,3,4,5,6,7,8,9,10].map((n) => (
                  <div key={n} className={`flex-1 h-2 rounded-full ${n <= result.score ? (result.score >= 8 ? 'bg-emerald-400' : result.score >= 5 ? 'bg-amber-400' : 'bg-rose-400') : 'bg-slate-700'}`} />
                ))}
              </div>
              <p className="text-sm text-slate-300 leading-relaxed">{result.feedback}</p>
            </div>
          </div>

          {/* Mistakes */}
          {result.mistakes.length > 0 && (
            <div className="card border-rose-500/20">
              <div className="flex items-center gap-2 mb-3 text-rose-400 text-sm font-semibold">
                <span>⚠️</span> Kamchiliklar
              </div>
              <ul className="space-y-1.5">
                {result.mistakes.map((m, i) => (
                  <li key={i} className="text-sm text-slate-300 flex items-start gap-2">
                    <span className="text-rose-500 mt-0.5">•</span>{m}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Ideal answer */}
          <div className="card border-emerald-500/20">
            <div className="flex items-center gap-2 mb-3 text-emerald-400 text-sm font-semibold">
              <Lightbulb size={15} /> Ideal javob
            </div>
            <p className="text-sm text-slate-300 leading-relaxed">{result.idealAnswer}</p>
          </div>

          {/* Key points */}
          {result.keyPoints.length > 0 && (
            <div className="card">
              <div className="flex items-center gap-2 mb-3 text-amber-400 text-sm font-semibold">
                <Star size={15} /> Asosiy tushunchalar
              </div>
              <div className="flex flex-wrap gap-2">
                {result.keyPoints.map((kp, i) => (
                  <span key={i} className="px-2.5 py-1 bg-amber-500/10 border border-amber-500/20 rounded-lg text-xs text-amber-300">
                    {kp}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Resources */}
          {result.resources.length > 0 && (
            <div className="card">
              <div className="flex items-center gap-2 mb-3 text-accent-500 text-sm font-semibold">
                <BookOpen size={15} /> O'qish materiallari
              </div>
              <div className="space-y-2">
                {result.resources.map((r, i) => (
                  <a key={i} href={r.url} target="_blank" rel="noreferrer"
                    className="flex items-center justify-between p-2.5 rounded-lg bg-slate-800 hover:bg-slate-700 transition-colors group">
                    <span className="text-sm text-slate-300 group-hover:text-white">{r.title}</span>
                    <ChevronRight size={14} className="text-slate-500 group-hover:text-accent-500" />
                  </a>
                ))}
              </div>
            </div>
          )}

          {/* Next */}
          <button onClick={nextQuestion} className="btn-primary w-full flex items-center justify-center gap-2">
            <RefreshCw size={15} />
            {currentIdx < questions.length - 1 ? 'Keyingi savol' : 'Intervyuni yakunlash'}
          </button>
        </div>
      )}
    </div>
  )
}
