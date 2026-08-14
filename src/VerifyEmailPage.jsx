import { useEffect, useState } from 'react'
import { useLanguage } from './i18n.jsx'
import { verifyEmailToken } from './auth.js'

function getTokenFromHash() {
  const query = window.location.hash.split('?')[1] || ''
  return new URLSearchParams(query).get('token') || ''
}

export default function VerifyEmailPage() {
  const { t } = useLanguage()
  const a = t.auth.verifyEmail
  const [status, setStatus] = useState('checking')

  useEffect(() => {
    const token = getTokenFromHash()
    const result = verifyEmailToken(token)
    setStatus(result.ok ? 'success' : 'error')
  }, [])

  return (
    <main>
      <section className="demo-hero">
        <div className="container">
          <h1>{status === 'success' ? a.successTitle : status === 'error' ? a.errorTitle : a.verifying}</h1>
        </div>
      </section>
      <section className="demo-section">
        <div className="container auth-shell">
          {status === 'success' && (
            <div className="form-success">
              <p>{a.successBody}</p>
            </div>
          )}
          {status === 'error' && (
            <div className="field-error-panel">
              <p>{a.errorBody}</p>
            </div>
          )}
          {status !== 'checking' && (
            <p className="auth-switch">
              <a href="#/login">{a.goToLogin}</a>
            </p>
          )}
        </div>
      </section>
    </main>
  )
}
