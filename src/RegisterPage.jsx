import { useEffect, useRef, useState } from 'react'
import { useLanguage } from './i18n.jsx'
import { Icon } from './icons.jsx'
import { registerUser, isValidEmail, isValidUsername, isPasswordCommon } from './auth.js'

export default function RegisterPage() {
  const { t } = useLanguage()
  const a = t.auth
  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [email, setEmail] = useState('')
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [errors, setErrors] = useState({})
  const [submitting, setSubmitting] = useState(false)
  const [result, setResult] = useState(null)
  const resultRef = useRef(null)

  useEffect(() => {
    if (result) resultRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' })
  }, [result])

  function validate() {
    const e = {}
    if (!firstName.trim() || !lastName.trim() || !email.trim() || !username.trim() || !password || !confirmPassword) {
      e.form = a.register.errors.required
    }
    if (email && !isValidEmail(email)) e.email = a.register.errors.invalidEmail
    if (username && !isValidUsername(username)) e.username = a.register.errors.usernameInvalid
    if (password && password.length < 12) e.password = a.register.errors.passwordShort
    else if (password && isPasswordCommon(password)) e.password = a.register.errors.passwordCommon
    if (confirmPassword && password !== confirmPassword) e.confirmPassword = a.register.errors.passwordMismatch
    return e
  }

  async function handleSubmit(ev) {
    ev.preventDefault()
    const validation = validate()
    if (Object.keys(validation).length) {
      setErrors(validation)
      return
    }
    setErrors({})
    setSubmitting(true)
    const res = await registerUser({ firstName, lastName, email, username, password })
    setSubmitting(false)
    if (!res.ok && res.error === 'username_taken') {
      setErrors({ username: a.register.errors.usernameTaken })
      return
    }
    setResult(res)
  }

  if (result) {
    return (
      <main>
        <section className="demo-hero">
          <div className="container">
            <span className="eyebrow">{a.register.eyebrow}</span>
            <h1>{a.register.title}</h1>
          </div>
        </section>
        <section className="demo-section">
          <div className="container auth-shell" ref={resultRef}>
            <div className="form-success">
              <strong>{a.register.successTitle}</strong>
              <p>{a.register.successBody.replace('{email}', email)}</p>
            </div>
            {result.token && (
              <div className="dummy-panel">
                <div className="dummy-panel-head">
                  <Icon name="flask" size={18} />
                  <strong>{a.register.devPanelLabel}</strong>
                </div>
                <a className="dev-panel-link" href={`#/verify-email?token=${result.token}`}>
                  {window.location.origin + window.location.pathname}#/verify-email?token={result.token}
                </a>
              </div>
            )}
            <p className="auth-switch">
              <a href="#/login">{a.login.title}</a>
            </p>
          </div>
        </section>
      </main>
    )
  }

  return (
    <main>
      <section className="demo-hero">
        <div className="container">
          <span className="eyebrow">{a.register.eyebrow}</span>
          <h1>{a.register.title}</h1>
        </div>
      </section>

      <section className="demo-section">
        <div className="container auth-shell">
          <form className="lead-form auth-card" onSubmit={handleSubmit} noValidate>
            <div className="form-two">
              <div className="form-row">
                <label htmlFor="firstName">{a.register.firstName}</label>
                <input id="firstName" type="text" value={firstName} onChange={(e) => setFirstName(e.target.value)} required />
              </div>
              <div className="form-row">
                <label htmlFor="lastName">{a.register.lastName}</label>
                <input id="lastName" type="text" value={lastName} onChange={(e) => setLastName(e.target.value)} required />
              </div>
            </div>

            <div className="form-row">
              <label htmlFor="email">{a.register.email}</label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder={a.register.emailPlaceholder}
                required
              />
              {errors.email && <p className="field-error">{errors.email}</p>}
            </div>

            <div className="form-row">
              <label htmlFor="username">{a.register.username}</label>
              <input
                id="username"
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder={a.register.usernamePlaceholder}
                required
              />
              {errors.username ? (
                <p className="field-error">{errors.username}</p>
              ) : (
                <p className="field-hint">{a.register.usernameHint}</p>
              )}
            </div>

            <div className="form-row">
              <label htmlFor="password">{a.register.password}</label>
              <div className="password-field">
                <input
                  id="password"
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
                  aria-label={showPassword ? a.login.hidePassword : a.login.showPassword}
                >
                  <Icon name={showPassword ? 'eyeOff' : 'eye'} size={18} />
                </button>
              </div>
              {errors.password ? (
                <p className="field-error">{errors.password}</p>
              ) : (
                <p className="field-hint">{a.register.passwordHint}</p>
              )}
            </div>

            <div className="form-row">
              <label htmlFor="confirmPassword">{a.register.confirmPassword}</label>
              <input
                id="confirmPassword"
                type={showPassword ? 'text' : 'password'}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                autoComplete="new-password"
                required
              />
              {errors.confirmPassword && <p className="field-error">{errors.confirmPassword}</p>}
            </div>

            {errors.form && <p className="field-error">{errors.form}</p>}

            <button type="submit" className="btn btn-dark" style={{ width: '100%' }} disabled={submitting}>
              {submitting ? a.register.submitting : a.register.submit}
            </button>

            <p className="auth-switch">
              {a.register.haveAccount} <a href="#/login">{a.register.logIn}</a>
            </p>
          </form>
        </div>
      </section>
    </main>
  )
}
