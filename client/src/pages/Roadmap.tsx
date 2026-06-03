import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { CheckCircle, Circle, Award, ChevronDown, ChevronRight } from 'lucide-react'
import { dashboardApi } from '../api/dashboard.api'
import { PageLoader } from '../components/ui'
import type { RoadmapNode } from '../types'

const tracks = [
  { value: 'FRONTEND', label: '🎨 Frontend', color: 'text-accent-500' },
  { value: 'BACKEND', label: '⚙️ Backend', color: 'text-violet-400' },
  { value: 'FULLSTACK', label: '🚀 Full Stack', color: 'text-emerald-400' },
]

export default function Roadmap() {
  const [track, setTrack] = useState('FRONTEND')
  const [expanded, setExpanded] = useState<string | null>(null)
  const qc = useQueryClient()

  const { data: nodes, isLoading } = useQuery({
    queryKey: ['roadmap', track],
    queryFn: () => dashboardApi.getRoadmap(track).then((r) => r.data.data as RoadmapNode[]),
  })

  const completeMutation = useMutation({
    mutationFn: (nodeId: string) => dashboardApi.completeNode(nodeId),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['roadmap', track] }),
  })

  const completed = nodes?.filter((n) => n.isCompleted).length || 0
  const total = nodes?.length || 0
  const pct = total > 0 ? Math.round((completed / total) * 100) : 0

  return (
    <div className="max-w-3xl mx-auto animate-slide-up space-y-6">
      <div>
        <h1 className="font-sans font-bold text-2xl text-white">Roadmap</h1>
        <p className="text-slate-400 text-sm mt-1">O'rganish yo'lini kuzating</p>
      </div>

      {/* Track tabs */}
      <div className="flex gap-2">
        {tracks.map((t) => (
          <button key={t.value} onClick={() => setTrack(t.value)}
            className={`px-4 py-2 rounded-xl text-sm font-semibold border transition-all ${
              track === t.value
                ? 'bg-accent-100 border-accent-200 text-accent-500'
                : 'bg-slate-800 border-slate-700 text-slate-400 hover:border-slate-600'
            }`}>
            {t.label}
          </button>
        ))}
      </div>

      {/* Progress */}
      <div className="card">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm text-slate-300 font-semibold">Umumiy progress</span>
          <span className="text-sm font-bold text-accent-500">{pct}%</span>
        </div>
        <div className="h-2 bg-slate-800 rounded-full overflow-hidden">
          <div className="h-full bg-accent-500 rounded-full transition-all duration-500"
            style={{ width: `${pct}%` }} />
        </div>
        <div className="text-xs text-slate-500 mt-2">{completed} / {total} mavzu tugatildi</div>
      </div>

      {isLoading ? <PageLoader /> : (
        <div className="space-y-2">
          {(nodes || []).map((node) => (
            <div key={node.id}
              className={`card transition-all border ${
                node.isCompleted ? 'border-emerald-500/20 bg-emerald-500/5' :
                node.isMilestone ? 'border-amber-500/20' : 'border-slate-800'
              }`}
            >
              <div className="flex items-center gap-4 cursor-pointer"
                onClick={() => setExpanded(expanded === node.id ? null : node.id)}>
                {/* Status icon */}
                <button
                  onClick={(e) => { e.stopPropagation(); if (!node.isCompleted) completeMutation.mutate(node.id) }}
                  className="shrink-0"
                >
                  {node.isCompleted
                    ? <CheckCircle size={22} className="text-emerald-400" />
                    : <Circle size={22} className="text-slate-600 hover:text-accent-500 transition-colors" />}
                </button>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-slate-500 font-mono">{String(node.orderIndex).padStart(2, '0')}.</span>
                    {node.isMilestone && <Award size={13} className="text-amber-400" />}
                    <span className={`text-sm font-semibold ${node.isCompleted ? 'text-emerald-300 line-through opacity-60' : 'text-white'}`}>
                      {node.title}
                    </span>
                    {node.isMilestone && <span className="text-xs text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded-md border border-amber-500/20">Milestone</span>}
                  </div>
                </div>

                {expanded === node.id
                  ? <ChevronDown size={15} className="text-slate-500 shrink-0" />
                  : <ChevronRight size={15} className="text-slate-500 shrink-0" />}
              </div>

              {expanded === node.id && (
                <div className="mt-3 ml-[46px] space-y-3 animate-slide-up">
                  {node.description && (
                    <p className="text-sm text-slate-400 leading-relaxed">{node.description}</p>
                  )}
                  {node.resources && node.resources.length > 0 && (
                    <div>
                      <div className="text-xs text-slate-500 uppercase tracking-wider mb-1.5">Resurslar</div>
                      <div className="space-y-1">
                        {(node.resources as any[]).map((r, i) => (
                          <a key={i} href={r.url} target="_blank" rel="noreferrer"
                            className="flex items-center gap-2 text-xs text-accent-500 hover:underline">
                            <ChevronRight size={11} />{r.title}
                          </a>
                        ))}
                      </div>
                    </div>
                  )}
                  {!node.isCompleted && (
                    <button onClick={() => completeMutation.mutate(node.id)}
                      className="text-xs text-emerald-400 hover:text-emerald-300 border border-emerald-500/20 hover:border-emerald-500/40 px-3 py-1.5 rounded-lg transition-all">
                      ✓ Tugatildi deb belgilash
                    </button>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
