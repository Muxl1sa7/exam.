import { useState } from 'react'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { Save, Camera } from 'lucide-react'
import { authApi } from '../api/auth.api'
import { useAuthStore } from '../store/authStore'
import { Alert, Spinner } from '../components/ui'

const tracks = [
  { value: 'FRONTEND', label: '🎨 Frontend' },
  { value: 'BACKEND', label: '⚙️ Backend' },
  { value: 'FULLSTACK', label: '🚀 Full Stack' },
]

export default function Profile() {
  const { user, setUser } = useAuthStore()
  const [form, setForm] = useState({ fullName: user?.fullName || '', track: user?.track || '' })
  const [passwords, setPasswords] = useState({ currentPassword: '', newPassword: '' })
  const [msg, setMsg] = useState('')
  const [err, setErr] = useState('')

  const profileMutation = useMutation({
    mutationFn: () => authApi.updateProfile(form).then((r) => r.data.data),
    onSuccess: (data) => { setUser(data); setMsg('Profil yangilandi!'); setErr('') },
    onError: (e: any) => { setErr(e.response?.data?.message || 'Xatolik'); setMsg('') },
  })

  const passMutation = useMutation({
    mutationFn: () => authApi.changePassword(passwords.currentPassword, passwords.newPassword),
    onSuccess: () => { setMsg('Parol yangilandi!'); setErr(''); setPasswords({ currentPassword: '', newPassword: '' }) },
    onError: (e: any) => { setErr(e.response?.data?.message || 'Xatolik'); setMsg('') },
  })

  return (
    <div className="max-w-xl mx-auto animate-slide-up space-y-6">
      <h1 className="font-sans font-bold text-2xl text-white">Profil</h1>
      {msg && <Alert type="success" message={msg} />}
      {err && <Alert type="error" message={err} />}

      <div className="card flex items-center gap-4">
        <div className="relative">
          <div className="w-16 h-16 rounded-full bg-gradient-to-br from-accent-500 to-violet-500 flex items-center justify-center font-bold text-dark-900 text-2xl">
            {user?.fullName?.charAt(0)}
          </div>
        </div>
        <div>
          <div className="font-bold text-white text-lg">{user?.fullName}</div>
          <div className="text-slate-400 text-sm">{user?.email}</div>
          <div className="text-xs text-slate-500 mt-1">{user?.role === 'ADMIN' ? '👑 Admin' : '👤 Foydalanuvchi'}</div>
        </div>
      </div>

      <div className="card space-y-4">
        <h3 className="font-semibold text-white text-sm">Shaxsiy ma'lumotlar</h3>
        <div>
          <label className="text-xs text-slate-400 uppercase tracking-wider mb-1.5 block">To'liq ism</label>
          <input className="input" value={form.fullName} onChange={(e) => setForm({ ...form, fullName: e.target.value })} />
        </div>
        <div>
          <label className="text-xs text-slate-400 uppercase tracking-wider mb-1.5 block">Yo'nalish</label>
          <div className="grid grid-cols-3 gap-2">
            {tracks.map((t) => (
              <button key={t.value} type="button"
                onClick={() => setForm({ ...form, track: form.track === t.value ? '' : t.value })}
                className={`p-2 rounded-lg text-xs font-semibold border transition-all ${
                  form.track === t.value ? 'bg-accent-100 border-accent-200 text-accent-500' : 'bg-slate-800 border-slate-700 text-slate-400'
                }`}>
                {t.label}
              </button>
            ))}
          </div>
        </div>
        <button onClick={() => profileMutation.mutate()} disabled={profileMutation.isPending}
          className="btn-primary flex items-center gap-2">
          {profileMutation.isPending ? <Spinner size={14} /> : <Save size={14} />}
          Saqlash
        </button>
      </div>

      <div className="card space-y-4">
        <h3 className="font-semibold text-white text-sm">Parolni o'zgartirish</h3>
        <div>
          <label className="text-xs text-slate-400 uppercase tracking-wider mb-1.5 block">Joriy parol</label>
          <input type="password" className="input" value={passwords.currentPassword}
            onChange={(e) => setPasswords({ ...passwords, currentPassword: e.target.value })} />
        </div>
        <div>
          <label className="text-xs text-slate-400 uppercase tracking-wider mb-1.5 block">Yangi parol</label>
          <input type="password" className="input" value={passwords.newPassword}
            onChange={(e) => setPasswords({ ...passwords, newPassword: e.target.value })} />
        </div>
        <button onClick={() => passMutation.mutate()} disabled={passMutation.isPending || !passwords.currentPassword}
          className="btn-secondary flex items-center gap-2">
          {passMutation.isPending ? <Spinner size={14} /> : null}
          Parolni yangilash
        </button>
      </div>
    </div>
  )
}
