import { useState } from 'react'
import { useSearchParams, useNavigate } from 'react-router-dom'
import { authApi } from '../../api/auth.api'
import { Alert, Spinner } from '../../components/ui'

export default function ResetPassword() {
  const [params] = useSearchParams()
  const navigate = useNavigate()
  const token = params.get('token') || ''
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    try {
      await authApi.resetPassword(token, password)
      navigate('/login')
    } catch (err: any) {
      setError(err.response?.data?.message || 'Xatolik yuz berdi')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="font-sans font-bold text-3xl text-white mb-2">Yangi parol 🔑</h1>
        <p className="text-slate-400 text-sm">Kamida 8 ta belgi, 1 katta harf, 1 raqam</p>
      </div>
      {error && <div className="mb-4"><Alert type="error" message={error} /></div>}
      <form onSubmit={handleSubmit} className="space-y-4">
        <input type="password" className="input" placeholder="Yangi parol"
          value={password} onChange={(e) => setPassword(e.target.value)} required minLength={8} />
        <button type="submit" disabled={loading} className="btn-primary w-full flex items-center justify-center gap-2">
          {loading ? <Spinner size={16} /> : null}
          {loading ? 'Saqlanmoqda...' : 'Parolni yangilash'}
        </button>
      </form>
    </div>
  )
}
