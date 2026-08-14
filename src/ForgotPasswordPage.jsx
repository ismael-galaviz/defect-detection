import { useEffect, useRef, useState } from 'react'
import { useLanguage } from './i18n.jsx'
import { Icon } from './icons.jsx'
import { requestPasswordReset, validateResetToken, resetPassword, isPasswordCommon } from './auth.js'

function getTokenFromHash() {
  const query = window.location.hash.split('?')[1] || ''
  return new URLSearchParams(query).get('token') || ''
}

export default function ForgotPasswordPage() {
  const token = getTokenFromHash()
  return token ? <ResetPasswordView token={token} /> : <RequestView />
}

function RequestView() {
  const { t } = useLanguage()
  const a = t.auth.forgotPassword
  const [identifier, setIdentifier] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [result, setResult] = useState(null)
  const resultRef = useRef(null)

  useEffect(() => {
    if (result) resultRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' })
  }, [result])

  function handleSubmit(e) {
    e.preventDefault()
    setSubmitting(true)
    const res = requestPasswordReset(identifier)
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
              {result.token && (
                <div className="dummy-panel">
                  <div className="dummy-panel-head">
                    <Icon name="flask" size={18} />
                    <strong>{a.devPanelLabel}</strong>
                  </div>
                  <a className="dev-panel-link" href={`#/forgot-password?token=${result.token}`}>
                    {window.location.origin + window.location.pathname}#/forgot-password?token={result.token}
                  </a>
                </div>
              )}
              <p className="auth-switch"><a href="#/login">{a.backToLogin}</a></p>
            </div>
          ) : (
            <form className="lead-form auth-card" onSubmit={handleSubmit}>
              <div className="form-row">
                <label htmlFor="identifier">{a.identifier}</label>
                <input
                  id="identifier"
                  type="text"
                  value={identifier}
                  onChange={(e) => setIdentifier(e.target.value)}
                  placeholder={a.identifierPlaceholder}
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

function ResetPasswordView({ token }) {
  const { t } = useLanguage()
  const a = t.auth.resetPassword
  // Frozen at mount: resetPassword() deletes the token on success, so re-validating on every
  // render would flip this to "invalid" right after a successful submit re-renders the page.
  const [check] = useState(() => validateResetToken(token))
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState(null)
  const [submitting, setSubmitting] = useState(false)
  const [done, setDone] = useState(false)
  const doneRef = useRef(null)

  useEffect(() => {
    if (done) doneRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' })
  }, [done])

  async function handleSubmit(e) {
    e.preventDefault()
    if (password.length < 12) return setError(a.errors.passwordShort)
    if (isPasswordCommon(password)) return setError(a.errors.passwordCommon)
    if (password !== confirmPassword) return setError(a.errors.passwordMismatch)
    setError(null)
    setSubmitting(true)
    const res = await resetPassword(token, password)
    setSubmitting(false)
    if (!res.ok) {
      setError(a.invalidBody)
      return
    }
    setDone(true)
  }

  if (!check.ok) {
    return (
      <main>
        <section className="demo-hero">
          <div className="container">
            <span className="eyebrow">{t.auth.forgotPassword.eyebrow}</span>
            <h1>{a.invalidTitle}</h1>
          </div>
        </section>
        <section className="demo-section">
          <div className="container auth-shell">
            <div className="field-error-panel"><p>{a.invalidBody}</p></div>
            <p className="auth-switch"><a href="#/forgot-password">{a.requestNew}</a></p>
          </div>
        </section>
      </main>
    )
  }

  if (done) {
    return (
      <main>
        <section className="demo-hero">
          <div className="container">
            <span className="eyebrow">{t.auth.forgotPassword.eyebrow}</span>
            <h1>{a.successTitle}</h1>
          </div>
        </section>
        <section className="demo-section">
          <div className="container auth-shell" ref={doneRef}>
            <div className="form-success"><p>{a.successBody}</p></div>
            <p className="auth-switch"><a href="#/login">{a.goToLogin}</a></p>
          </div>
        </section>
      </main>
    )
  }

  return (
    <main>
      <section className="demo-hero">
        <div className="container">
          <span className="eyebrow">{t.auth.forgotPassword.eyebrow}</span>
          <h1>{a.title}</h1>
        </div>
      </section>
      <section className="demo-section">
        <div className="container auth-shell">
          <form className="lead-form auth-card" onSubmit={handleSubmit}>
            <div className="form-row">
              <label htmlFor="newPassword">{a.newPassword}</label>
              <div className="password-field">
                <input
                  id="newPassword"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  autoComplete="new-password"
                  required
                />
                <button
                  type="button"
                  className="password-toggle"
                  onClick={() => setShowPassword((s) => !s)}
                  aria-label={showPassword ? t.auth.login.hidePassword : t.auth.login.showPassword}
                >
                  <Icon name={showPassword ? 'eyeOff' : 'eye'} size={18} />
                </button>
              </div>
            </div>
            <div className="form-row">
              <label htmlFor="confirmPassword">{a.confirmPassword}</label>
              <input
                id="confirmPassword"
                type={showPassword ? 'text' : 'password'}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                autoComplete="new-password"
                required
              />
            </div>
            {error && <p className="field-error">{error}</p>}
            <button type="submit" className="btn btn-dark" style={{ width: '100%' }} disabled={submitting}>
              {submitting ? a.submitting : a.submit}
            </button>
          </form>
        </div>
      </section>
    </main>
  )
}
