import { useEffect, useState } from 'react'
import { useSearchParams, Link } from 'react-router-dom'
import { authApi } from '../../api/auth.api'
import { Spinner } from '../../components/ui'

export default function VerifyEmail() {
  const [params] = useSearchParams()
  const token = params.get('token') || ''
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading')

  useEffect(() => {
    if (!token) { setStatus('error'); return }
    authApi.verifyEmail(token)
      .then(() => setStatus('success'))
      .catch(() => setStatus('error'))
  }, [token])

  return (
    <div className="text-center">
      {status === 'loading' && (
        <div className="flex flex-col items-center gap-4">
          <Spinner size={40} />
          <p className="text-slate-400">Email tasdiqlanmoqda...</p>
        </div>
      )}
      {status === 'success' && (
        <div>
          <div className="text-6xl mb-4">✅</div>
          <h2 className="font-sans font-bold text-2xl text-white mb-2">Email tasdiqlandi!</h2>
          <p className="text-slate-400 mb-6">Endi hisobingizga kirishingiz mumkin.</p>
          <Link to="/login" className="btn-primary inline-block">Kirish</Link>
        </div>
      )}
      {status === 'error' && (
        <div>
          <div className="text-6xl mb-4">❌</div>
          <h2 className="font-sans font-bold text-2xl text-white mb-2">Token noto'g'ri</h2>
          <p className="text-slate-400 mb-6">Havola muddati o'tgan yoki noto'g'ri.</p>
          <Link to="/login" className="btn-secondary inline-block">Kirish sahifasi</Link>
        </div>
      )}
    </div>
  )
}
