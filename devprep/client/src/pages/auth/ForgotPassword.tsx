import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Mail } from 'lucide-react'
import { authApi } from '../../api/auth.api'
import { Alert, Spinner } from '../../components/ui'

export default function ForgotPassword() {
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [sent, setSent] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    try {
      await authApi.forgotPassword(email)
      setSent(true)
    } catch (err: any) {
      setError(err.response?.data?.message || 'Xatolik yuz berdi')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="font-sans font-bold text-3xl text-white mb-2">Parolni tiklash 🔐</h1>
        <p className="text-slate-400 text-sm">Emailingizga tiklash havolasi yuboramiz</p>
      </div>
      {sent ? (
        <Alert type="success" message="Email yuborildi! Inbox yoki spam papkangizni tekshiring." />
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4">
          {error && <Alert type="error" message={error} />}
          <div>
            <label className="text-xs text-slate-400 mb-1.5 block uppercase tracking-wider">Email</label>
            <input type="email" className="input" placeholder="you@example.com"
              value={email} onChange={(e) => setEmail(e.target.value)} required />
          </div>
          <button type="submit" disabled={loading} className="btn-primary w-full flex items-center justify-center gap-2">
            {loading ? <Spinner size={16} /> : <Mail size={16} />}
            {loading ? 'Yuborilmoqda...' : 'Havola yuborish'}
          </button>
        </form>
      )}
      <p className="text-center text-sm text-slate-400 mt-6">
        <Link to="/login" className="text-accent-500 hover:underline">← Kirish sahifasiga qaytish</Link>
      </p>
    </div>
  )
}
