import { useState } from 'react'
import { useLanguage } from './i18n.jsx'
import { Icon } from './icons.jsx'
import { login, IS_DUMMY_LOGIN_ENABLED } from './auth.js'

export default function LoginPage() {
  const { t } = useLanguage()
  const a = t.auth
  const [identifier, setIdentifier] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState(null)
  const [submitting, setSubmitting] = useState(false)

  function fillDummy() {
    setIdentifier('test')
    setPassword('vision')
    setError(null)
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setError(null)
    setSubmitting(true)
    const result = await login(identifier, password)
    setSubmitting(false)
    if (result.ok) {
      window.location.hash = '#/vision-home'
      return
    }
    setError(result.error)
  }

  return (
    <main>
      <section className="demo-hero">
        <div className="container">
          <span className="eyebrow">{a.login.eyebrow}</span>
          <h1>{a.login.title}</h1>
        </div>
      </section>

      <section className="demo-section">
        <div className="container auth-shell">
          {IS_DUMMY_LOGIN_ENABLED && (
            <div className="dummy-panel">
              <div className="dummy-panel-head">
                <Icon name="flask" size={18} />
                <strong>{a.dummy.bannerTitle}</strong>
              </div>
              <p>{a.dummy.bannerBody}</p>
              <button type="button" className="btn btn-outline" onClick={fillDummy}>
                {a.dummy.fillButton}
              </button>
            </div>
          )}

          <form className="lead-form auth-card" onSubmit={handleSubmit}>
            <div className="form-row">
              <label htmlFor="identifier">{a.login.identifier}</label>
              <input
                id="identifier"
                type="text"
                value={identifier}
                onChange={(e) => setIdentifier(e.target.value)}
                placeholder={a.login.identifierPlaceholder}
                autoComplete="username"
                required
              />
            </div>
            <div className="form-row">
              <label htmlFor="password">{a.login.password}</label>
              <div className="password-field">
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder={a.login.passwordPlaceholder}
                  autoComplete="current-password"
                  required
                />
                <button
                  type="button"
                  className="password-toggle"
                  onClick={() => setShowPassword((s) => !s)}
                  aria-label={showPassword ? a.login.hidePassword : a.login.showPassword}
                >
                  <Icon name={showPassword ? 'eyeOff' : 'eye'} size={18} />
                </button>
              </div>
            </div>

            {error && (
              <p className="field-error">{a.login.errors[error] || a.login.errors.invalid_credentials}</p>
            )}

            <button type="submit" className="btn btn-dark" style={{ width: '100%' }} disabled={submitting}>
              {submitting ? a.login.submitting : a.login.submit}
            </button>

            <div className="auth-links">
              <a href="#/forgot-password">{a.login.forgotPassword}</a>
              <a href="#/recover-username">{a.login.forgotUsername}</a>
            </div>
            <p className="auth-switch">
              {a.login.noAccount} <a href="#/register">{a.login.createAccount}</a>
            </p>
          </form>
        </div>
      </section>
    </main>
  )
}
