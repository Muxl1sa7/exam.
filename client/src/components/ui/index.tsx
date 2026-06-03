import { Loader2 } from 'lucide-react'

// ─── SPINNER ────────────────────────────────────────────────────────────────
export function Spinner({ size = 20 }: { size?: number }) {
  return <Loader2 size={size} className="animate-spin text-accent-500" />
}

// ─── PAGE LOADER ────────────────────────────────────────────────────────────
export function PageLoader() {
  return (
    <div className="flex items-center justify-center h-64">
      <Spinner size={32} />
    </div>
  )
}

// ─── BADGE ──────────────────────────────────────────────────────────────────
type BadgeVariant = 'easy' | 'medium' | 'hard' | 'frontend' | 'backend' | 'general' | 'default'
export function Badge({ children, variant = 'default' }: { children: React.ReactNode; variant?: BadgeVariant }) {
  const cls: Record<BadgeVariant, string> = {
    easy: 'badge-easy',
    medium: 'badge-medium',
    hard: 'badge-hard',
    frontend: 'badge-frontend',
    backend: 'badge-backend',
    general: 'badge-general',
    default: 'bg-slate-800 text-slate-300 border border-slate-700',
  }
  return <span className={`badge ${cls[variant]}`}>{children}</span>
}

// ─── EMPTY STATE ─────────────────────────────────────────────────────────────
export function EmptyState({ icon, title, desc }: { icon: string; title: string; desc?: string }) {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      <div className="text-5xl mb-4">{icon}</div>
      <h3 className="font-semibold text-slate-300 mb-1">{title}</h3>
      {desc && <p className="text-sm text-slate-500">{desc}</p>}
    </div>
  )
}

// ─── MODAL ──────────────────────────────────────────────────────────────────
export function Modal({ isOpen, onClose, title, children }: {
  isOpen: boolean
  onClose: () => void
  title: string
  children: React.ReactNode
}) {
  if (!isOpen) return null
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      <div className="relative z-10 bg-dark-800 border border-slate-700 rounded-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto animate-slide-up">
        <div className="flex items-center justify-between p-6 border-b border-slate-800">
          <h2 className="font-sans font-bold text-white">{title}</h2>
          <button onClick={onClose} className="text-slate-500 hover:text-white transition-colors text-xl leading-none">&times;</button>
        </div>
        <div className="p-6">{children}</div>
      </div>
    </div>
  )
}

// ─── SCORE RING ──────────────────────────────────────────────────────────────
export function ScoreRing({ score, size = 80, label }: { score: number; size?: number; label?: string }) {
  const r = (size - 12) / 2
  const circ = 2 * Math.PI * r
  const offset = circ - (score / 100) * circ
  const color = score >= 70 ? '#10b981' : score >= 40 ? '#f59e0b' : '#ef4444'
  return (
    <div className="flex flex-col items-center gap-1">
      <svg width={size} height={size} className="-rotate-90">
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="#1e2d4a" strokeWidth={6} />
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke={color} strokeWidth={6}
          strokeDasharray={circ} strokeDashoffset={offset} strokeLinecap="round"
          style={{ transition: 'stroke-dashoffset 1s ease' }} />
      </svg>
      <div className="text-center -mt-12 mb-6">
        <div className="font-bold text-xl text-white">{score}%</div>
        {label && <div className="text-xs text-slate-400">{label}</div>}
      </div>
    </div>
  )
}

// ─── ALERT ──────────────────────────────────────────────────────────────────
export function Alert({ type, message }: { type: 'error' | 'success' | 'info'; message: string }) {
  const styles = {
    error: 'bg-rose-500/10 border-rose-500/20 text-rose-400',
    success: 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400',
    info: 'bg-accent-100 border-accent-200 text-accent-500',
  }
  return (
    <div className={`border rounded-lg px-4 py-3 text-sm font-mono ${styles[type]}`}>
      {message}
    </div>
  )
}
