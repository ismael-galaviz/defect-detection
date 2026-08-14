import { useEffect, useRef, useState } from 'react'
import { useLanguage } from './i18n.jsx'
import { Icon } from './icons.jsx'
import { recoverUsername } from './auth.js'

export default function RecoverUsernamePage() {
  const { t } = useLanguage()
  const a = t.auth.recoverUsername
  const [email, setEmail] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [result, setResult] = useState(null)
  const resultRef = useRef(null)

  useEffect(() => {
    if (result) resultRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' })
  }, [result])

  function handleSubmit(e) {
    e.preventDefault()
    setSubmitting(true)
    const res = recoverUsername(email)
    setSubmitting(false)
    setResult(res)
  }

  return (
    <main>
      <section className="demo-hero">
        <div className="container">
          <span className="eyebrow">{a.eyebrow}</span>
          <h1>{a.title}</h1>
        </div>
      </section>
      <section className="demo-section">
        <div className="container auth-shell">
          {result ? (
            <div ref={resultRef}>
              <div className="form-success"><p>{a.genericMessage}</p></div>
              {result.username && (
                <div className="dummy-panel">
                  <div className="dummy-panel-head">
                    <Icon name="flask" size={18} />
                    <strong>{a.devPanelLabel}</strong>
                  </div>
                  <p className="dev-panel-value">{result.username}</p>
                </div>
              )}
              <p className="auth-switch"><a href="#/login">{a.backToLogin}</a></p>
            </div>
          ) : (
            <form className="lead-form auth-card" onSubmit={handleSubmit}>
              <p className="section-sub" style={{ marginBottom: 22 }}>{a.sub}</p>
              <div className="form-row">
                <label htmlFor="email">{a.email}</label>
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder={a.emailPlaceholder}
                  required
                />
              </div>
              <button type="submit" className="btn btn-dark" style={{ width: '100%' }} disabled={submitting}>
                {submitting ? a.submitting : a.submit}
              </button>
              <p className="auth-switch"><a href="#/login">{a.backToLogin}</a></p>
            </form>
          )}
        </div>
      </section>
    </main>
  )
}
