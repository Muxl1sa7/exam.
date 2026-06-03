import { Outlet } from 'react-router-dom'
import { Zap } from 'lucide-react'

export default function AuthLayout() {
  return (
    <div className="min-h-screen bg-dark-900 flex">
      {/* Left panel */}
      <div className="hidden lg:flex flex-col w-1/2 bg-dark-800 border-r border-slate-800 p-12 relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 right-0 w-96 h-96 bg-accent-500/5 rounded-full blur-3xl" />
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-violet-500/5 rounded-full blur-3xl" />
        </div>

        <div className="flex items-center gap-3 mb-16 relative">
          <div className="w-10 h-10 rounded-xl bg-accent-500 flex items-center justify-center">
            <Zap size={20} className="text-dark-900" />
          </div>
          <div>
            <div className="font-sans font-bold text-lg text-white">DevPrep AI</div>
            <div className="text-xs text-accent-500">Interview Preparation Platform</div>
          </div>
        </div>

        <div className="relative flex-1 flex flex-col justify-center">
          <h2 className="font-sans font-bold text-4xl text-white mb-4 leading-tight">
            IT sohasida<br />
            <span className="gradient-text">orzuyingizga</span><br />
            yeting
          </h2>
          <p className="text-slate-400 text-sm leading-relaxed mb-10 max-w-sm">
            DevPrep AI — IT kurslarini bitirganlar uchun professional interview tayyorgarlik platformasi.
          </p>

          <div className="space-y-4">
            {[
              { icon: '🤖', title: 'AI bilan mashq qiling', desc: 'Javoblaringizni Claude AI baholaydi' },
              { icon: '📊', title: 'Progressingizni kuzating', desc: 'Kuchli va zaif tomonlaringizni biling' },
              { icon: '🏆', title: 'Raqobat qiling', desc: 'Leaderboardda yuqori o\'rin egallang' },
            ].map((item) => (
              <div key={item.title} className="flex items-start gap-3 p-3 rounded-xl bg-slate-800/50">
                <span className="text-xl">{item.icon}</span>
                <div>
                  <div className="text-sm font-semibold text-white">{item.title}</div>
                  <div className="text-xs text-slate-400">{item.desc}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right panel */}
      <div className="flex-1 flex items-center justify-center p-6">
        <div className="w-full max-w-md animate-slide-up">
          <Outlet />
        </div>
      </div>
    </div>
  )
}
