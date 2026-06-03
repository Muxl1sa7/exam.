import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { UserPlus, Eye, EyeOff } from 'lucide-react'
import { authApi } from '../../api/auth.api'
import { Alert, Spinner } from '../../components/ui'

const tracks = [
  { value: 'FRONTEND', label: '🎨 Frontend' },
  { value: 'BACKEND', label: '⚙️ Backend' },
  { value: 'FULLSTACK', label: '🚀 Full Stack' },
]

export default function Register() {
  const navigate = useNavigate()
  const [form, setForm] = useState({ email: '', password: '', fullName: '', track: '' })
  const [showPass, setShowPass] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    try {
      await authApi.register(form)
      setSuccess('Tabriklaymiz! Email manzilingizni tasdiqlang.')
      setTimeout(() => navigate('/login'), 3000)
    } catch (err: any) {
      setError(err.response?.data?.message || "Ro'yxatdan o'tish amalga oshmadi")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="font-sans font-bold text-3xl text-white mb-2">Hisob yarating 🚀</h1>
        <p className="text-slate-400 text-sm">DevPrep AI ga qo'shiling</p>
      </div>

      {error && <div className="mb-4"><Alert type="error" message={error} /></div>}
      {success && <div className="mb-4"><Alert type="success" message={success} /></div>}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="text-xs text-slate-400 mb-1.5 block uppercase tracking-wider">To'liq ism</label>
          <input className="input" placeholder="Sardor Rahimov" value={form.fullName}
            onChange={(e) => setForm({ ...form, fullName: e.target.value })} required />
        </div>
        <div>
          <label className="text-xs text-slate-400 mb-1.5 block uppercase tracking-wider">Email</label>
          <input type="email" className="input" placeholder="you@example.com" value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })} required />
        </div>
        <div>
          <label className="text-xs text-slate-400 mb-1.5 block uppercase tracking-wider">Parol</label>
          <div className="relative">
            <input type={showPass ? 'text' : 'password'} className="input pr-10"
              placeholder="Kamida 8 ta belgi, 1 katta harf, 1 raqam"
              value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} required />
            <button type="button" onClick={() => setShowPass(!showPass)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300">
              {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          </div>
        </div>
        <div>
          <label className="text-xs text-slate-400 mb-1.5 block uppercase tracking-wider">Yo'nalish (ixtiyoriy)</label>
          <div className="grid grid-cols-3 gap-2">
            {tracks.map((t) => (
              <button key={t.value} type="button"
                onClick={() => setForm({ ...form, track: form.track === t.value ? '' : t.value })}
                className={`p-2 rounded-lg text-xs font-semibold border transition-all ${
                  form.track === t.value
                    ? 'bg-accent-100 border-accent-200 text-accent-500'
                    : 'bg-slate-800 border-slate-700 text-slate-400 hover:border-slate-600'
                }`}>
                {t.label}
              </button>
            ))}
          </div>
        </div>

        <button type="submit" disabled={loading} className="btn-primary w-full flex items-center justify-center gap-2 mt-2">
          {loading ? <Spinner size={16} /> : <UserPlus size={16} />}
          {loading ? "Ro'yxatdan o'tilmoqda..." : "Ro'yxatdan o'tish"}
        </button>
      </form>

      <p className="text-center text-sm text-slate-400 mt-6">
        Hisobingiz bormi?{' '}
        <Link to="/login" className="text-accent-500 font-semibold hover:underline">Kirish</Link>
      </p>
    </div>
  )
}
