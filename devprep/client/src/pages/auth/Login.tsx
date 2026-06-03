import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Eye, EyeOff, LogIn } from 'lucide-react'
import { authApi } from '../../api/auth.api'
import { useAuthStore } from '../../store/authStore'
import { Alert, Spinner } from '../../components/ui'

export default function Login() {
  const navigate = useNavigate()
  const setAuth = useAuthStore((s) => s.setAuth)
  const [form, setForm] = useState({ email: '', password: '' })
  const [showPass, setShowPass] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    try {
      const res = await authApi.login(form)
      const { accessToken, user } = res.data.data
      setAuth(user, accessToken)
      navigate('/dashboard')
    } catch (err: any) {
      setError(err.response?.data?.message || 'Kirish amalga oshmadi')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="font-sans font-bold text-3xl text-white mb-2">Xush kelibsiz 👋</h1>
        <p className="text-slate-400 text-sm">Hisobingizga kiring</p>
      </div>

      {error && <div className="mb-4"><Alert type="error" message={error} /></div>}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="text-xs text-slate-400 mb-1.5 block uppercase tracking-wider">Email</label>
          <input
            type="email"
            className="input"
            placeholder="you@example.com"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            required
          />
        </div>
        <div>
          <div className="flex items-center justify-between mb-1.5">
            <label className="text-xs text-slate-400 uppercase tracking-wider">Parol</label>
            <Link to="/forgot-password" className="text-xs text-accent-500 hover:underline">
              Parolni unutdingizmi?
            </Link>
          </div>
          <div className="relative">
            <input
              type={showPass ? 'text' : 'password'}
              className="input pr-10"
              placeholder="••••••••"
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              required
            />
            <button
              type="button"
              onClick={() => setShowPass(!showPass)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300"
            >
              {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          </div>
        </div>

        <button type="submit" disabled={loading} className="btn-primary w-full flex items-center justify-center gap-2 mt-2">
          {loading ? <Spinner size={16} /> : <LogIn size={16} />}
          {loading ? 'Kirilmoqda...' : 'Kirish'}
        </button>
      </form>

      <p className="text-center text-sm text-slate-400 mt-6">
        Hisobingiz yo'qmi?{' '}
        <Link to="/register" className="text-accent-500 font-semibold hover:underline">
          Ro'yxatdan o'ting
        </Link>
      </p>
    </div>
  )
}
