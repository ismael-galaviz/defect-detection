import { useEffect, useRef, useState } from 'react'
import { LanguageProvider, useLanguage } from './i18n.jsx'
import DemoPage from './DemoPage.jsx'
import CalculatorPage from './CalculatorPage.jsx'

const ICON_PATHS = {
  bolt: <path d="M13 2 4 14h6l-1 8 9-12h-6l1-8z" />,
  link: (
    <>
      <path d="M9 15 15 9" />
      <path d="M10.5 6.5 13 4a4 4 0 1 1 5.5 5.8L16 12" />
      <path d="M13.5 17.5 11 20a4 4 0 1 1-5.5-5.8L8 12" />
    </>
  ),
  sliders: (
    <>
      <line x1="4" y1="7" x2="20" y2="7" />
      <circle cx="9" cy="7" r="2" />
      <line x1="4" y1="12" x2="20" y2="12" />
      <circle cx="16" cy="12" r="2" />
      <line x1="4" y1="17" x2="20" y2="17" />
      <circle cx="11" cy="17" r="2" />
    </>
  ),
  weave: (
    <>
      <rect x="4" y="4" width="16" height="16" rx="2" />
      <path d="M4 9h16M4 14h16M9 4v16M14 4v16" />
    </>
  ),
  droplet: <path d="M12 3s6 6.5 6 11a6 6 0 0 1-12 0c0-4.5 6-11 6-11Z" />,
  eyeCheck: (
    <>
      <path d="M1.5 7.5S4.7 3.2 9 3.2s7.5 4.3 7.5 4.3-3.2 4.3-7.5 4.3-7.5-4.3-7.5-4.3Z" />
      <circle cx="9" cy="7.5" r="1.9" />
      <circle cx="18.3" cy="17.8" r="4.7" />
      <path d="m16.3 17.8 1.4 1.4 2.8-3" />
    </>
  ),
  pause: (
    <>
      <rect x="7" y="6" width="3.5" height="12" rx="1" />
      <rect x="13.5" y="6" width="3.5" height="12" rx="1" />
    </>
  ),
  tag: (
    <>
      <path d="M12.6 3H5a2 2 0 0 0-2 2v7.6a2 2 0 0 0 .6 1.4l8.4 8.4a2 2 0 0 0 2.8 0l6.2-6.2a2 2 0 0 0 0-2.8L12.6 3Z" />
      <circle cx="8.5" cy="8.5" r="1.4" />
    </>
  ),
  mail: (
    <>
      <rect x="3" y="5" width="18" height="14" rx="2" />
      <path d="m4 7 8 6 8-6" />
    </>
  ),
  pin: (
    <>
      <path d="M12 22s7-7.4 7-12.5A7 7 0 0 0 5 9.5C5 14.6 12 22 12 22Z" />
      <circle cx="12" cy="9.5" r="2.3" />
    </>
  ),
  gear: (
    <>
      <circle cx="12" cy="12" r="3" />
      <path d="M12 2.5v3M12 18.5v3M21.5 12h-3M5.5 12h-3M18.4 5.6l-2.1 2.1M7.7 16.3l-2.1 2.1M18.4 18.4l-2.1-2.1M7.7 7.7 5.6 5.6" />
    </>
  ),
  target: (
    <>
      <circle cx="12" cy="12" r="9" />
      <circle cx="12" cy="12" r="5" />
      <circle cx="12" cy="12" r="1" />
    </>
  ),
  activity: <path d="M2 12h4l2-7 4 14 2-7h8" />,
  percent: (
    <>
      <path d="M5 19 19 5" />
      <circle cx="7.5" cy="7.5" r="2.3" />
      <circle cx="16.5" cy="16.5" r="2.3" />
    </>
  ),
  cloud: <path d="M6.5 17a3.8 3.8 0 0 1 0-7.6 5 5 0 0 1 9.6-1.7A3.6 3.6 0 0 1 17 17H6.5Z" />,
  globe: (
    <>
      <circle cx="12" cy="12" r="9" />
      <path d="M3 12h18M12 3c2.4 2.5 3.7 6 3.7 9s-1.3 6.5-3.7 9c-2.4-2.5-3.7-6-3.7-9S9.6 5.5 12 3Z" />
    </>
  ),
  chevronDown: <path d="m6 9 6 6 6-6" />,
}

function Icon({ name, size = 22 }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      {ICON_PATHS[name]}
    </svg>
  )
}

function useRoute() {
  const [hash, setHash] = useState(window.location.hash)
  useEffect(() => {
    const onHash = () => setHash(window.location.hash)
    window.addEventListener('hashchange', onHash)
    return () => window.removeEventListener('hashchange', onHash)
  }, [])
  if (hash.startsWith('#/demo')) return 'demo'
  if (hash.startsWith('#/calculator')) return 'calculator'
  return 'home'
}

function LangSwitch() {
  const { lang, setLang } = useLanguage()
  return (
    <select
      className="lang-switch"
      value={lang}
      onChange={(e) => setLang(e.target.value)}
      aria-label="Language / Idioma"
    >
      <option value="es">🇲🇽 ES</option>
      <option value="en">🇺🇸 EN</option>
    </select>
  )
}

function NavDropdown({ label, items, isOpen, onToggle, onNavigate }) {
  return (
    <div className="nav-dropdown">
      <button
        type="button"
        className="nav-dropdown-trigger"
        aria-haspopup="true"
        aria-expanded={isOpen}
        onClick={onToggle}
      >
        {label}
        <span className={`chev${isOpen ? ' open' : ''}`}><Icon name="chevronDown" size={14} /></span>
      </button>
      {isOpen && (
        <div className="nav-dropdown-panel">
          {items.map((i) => (
            <a key={i.href} href={i.href} onClick={onNavigate}>{i.label}</a>
          ))}
        </div>
      )}
    </div>
  )
}

function MobileAccordion({ label, items, onNavigate }) {
  const [open, setOpen] = useState(false)
  return (
    <div className="mobile-accordion">
      <button
        type="button"
        className="mobile-accordion-trigger"
        aria-expanded={open}
        onClick={() => setOpen((o) => !o)}
      >
        {label}
        <span className={`chev${open ? ' open' : ''}`}><Icon name="chevronDown" size={16} /></span>
      </button>
      {open && (
        <div className="mobile-accordion-panel">
          {items.map((i) => (
            <a key={i.href} href={i.href} onClick={onNavigate}>{i.label}</a>
          ))}
        </div>
      )}
    </div>
  )
}

function Header() {
  const { t } = useLanguage()
  const [menuOpen, setMenuOpen] = useState(false)
  const [openDropdown, setOpenDropdown] = useState(null)
  const navRef = useRef(null)

  useEffect(() => {
    if (!openDropdown) return
    function onDocClick(e) {
      if (navRef.current && !navRef.current.contains(e.target)) setOpenDropdown(null)
    }
    function onKey(e) {
      if (e.key === 'Escape') setOpenDropdown(null)
    }
    document.addEventListener('mousedown', onDocClick)
    document.addEventListener('keydown', onKey)
    return () => {
      document.removeEventListener('mousedown', onDocClick)
      document.removeEventListener('keydown', onKey)
    }
  }, [openDropdown])

  function toggleDropdown(name) {
    setOpenDropdown((cur) => (cur === name ? null : name))
  }

  return (
    <header className="site-header">
      <div className="container nav-wrap">
        <a href="#" className="logo">
          <span className="logo-mark" aria-hidden="true" />
          VeritX Vision
        </a>
        <nav className="nav-links" ref={navRef}>
          <a href="#">{t.nav.home}</a>
          <NavDropdown
            label={t.nav.product}
            items={t.nav.productItems}
            isOpen={openDropdown === 'product'}
            onToggle={() => toggleDropdown('product')}
            onNavigate={() => setOpenDropdown(null)}
          />
          <NavDropdown
            label={t.nav.toolsLabel}
            items={t.nav.toolsItems}
            isOpen={openDropdown === 'tools'}
            onToggle={() => toggleDropdown('tools')}
            onNavigate={() => setOpenDropdown(null)}
          />
          <NavDropdown
            label={t.nav.aboutLabel}
            items={t.nav.aboutItems}
            isOpen={openDropdown === 'about'}
            onToggle={() => toggleDropdown('about')}
            onNavigate={() => setOpenDropdown(null)}
          />
        </nav>
        <div className="nav-cta">
          <LangSwitch />
          <button
            type="button"
            className="mobile-toggle"
            aria-label="Menu"
            aria-expanded={menuOpen}
            onClick={() => setMenuOpen((o) => !o)}
          >
            {menuOpen ? '✕' : '☰'}
          </button>
        </div>
      </div>
      {menuOpen && (
        <nav className="mobile-menu">
          <a href="#" onClick={() => setMenuOpen(false)}>{t.nav.home}</a>
          <MobileAccordion label={t.nav.product} items={t.nav.productItems} onNavigate={() => setMenuOpen(false)} />
          <MobileAccordion label={t.nav.toolsLabel} items={t.nav.toolsItems} onNavigate={() => setMenuOpen(false)} />
          <MobileAccordion label={t.nav.aboutLabel} items={t.nav.aboutItems} onNavigate={() => setMenuOpen(false)} />
        </nav>
      )}
    </header>
  )
}

function Hero() {
  const { t } = useLanguage()
  return (
    <section className="hero">
      <div className="container hero-grid">
        <div>
          <span className="eyebrow">{t.hero.eyebrow}</span>
          <h1>
            {t.hero.titleStart}<span className="accent">{t.hero.titleAccent}</span>
          </h1>
          <p className="lead">{t.hero.lead}</p>
          <div className="hero-actions">
            <a href="#contact" className="btn btn-primary">{t.hero.ctaPrimary}</a>
            <a href="#how-it-works" className="btn btn-ghost">{t.hero.ctaSecondary}</a>
          </div>
          <div className="hero-stats">
            {t.hero.stats.map((s) => (
              <div className="hero-stat" key={s.label}>
                <div className="num">{s.num}</div>
                <div className="label">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
        <div className="hero-visual">
          <div className="scan-frame">
            <div className="scan-line" />
            {t.hero.defectTags.map((d) => (
              <div className="defect-tag" key={d.label} data-label={d.label} style={d.style} />
            ))}
          </div>
          <div className="hero-visual-caption">
            <span><span className="dot-live" />{t.hero.liveFeed}</span>
            <span>{t.hero.feedDetail}</span>
          </div>
        </div>
      </div>
    </section>
  )
}

function VisionA() {
  const { t } = useLanguage()
  return (
    <section id="vision-a" className="visiona-section">
      <div className="container visiona-grid">
        <div>
          <span className="eyebrow">{t.visionA.eyebrow}</span>
          <h2 className="section-title">{t.visionA.title}</h2>
          <p className="section-sub">{t.visionA.sub}</p>
          <div className="visiona-features">
            {t.visionA.features.map((f) => (
              <div className="visiona-feature" key={f.icon}>
                <div className="vf-icon"><Icon name={f.icon} /></div>
                <div>
                  <h4>{f.title}</h4>
                  <p>{f.body}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="visiona-visual">
          <div className="device-frame">
            <div className="device-name">VeritX <strong>Vision A</strong></div>
            <div className="device-bar" aria-hidden="true"><i /><i /><i /></div>
            <div className="device-beam" aria-hidden="true" />
            <div className="device-fabric" aria-hidden="true">
              <div className="scan-line" />
            </div>
          </div>
          <div className="visiona-tags">
            {t.visionA.tags.map((tag) => (
              <span key={tag}>{tag}</span>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

function HowItWorks() {
  const { t } = useLanguage()
  return (
    <section id="how-it-works">
      <div className="container">
        <span className="eyebrow">{t.howItWorks.eyebrow}</span>
        <h2 className="section-title">{t.howItWorks.title}</h2>
        <p className="section-sub">{t.howItWorks.sub}</p>
        <div className="steps-grid">
          {t.howItWorks.steps.map((s) => (
            <div className="step-card" key={s.n}>
              <div className="step-num">{s.n}</div>
              <h4>{s.title}</h4>
              <p>{s.body}</p>
            </div>
          ))}
        </div>

        <div className="integration-card">
          <div className="integration-icon"><Icon name="gear" size={26} /></div>
          <div className="integration-body">
            <h4>{t.howItWorks.integration.title}</h4>
            <p>{t.howItWorks.integration.body}</p>
            <div className="integration-examples">
              {t.howItWorks.integration.examples.map((ex) => (
                <div className="integration-example" key={ex.action}>
                  <span className="ex-icon"><Icon name={ex.icon} size={18} /></span>
                  <p className="ex-text">
                    <strong>{ex.rule}</strong>
                    <span className="ex-arrow">→</span>
                    {ex.action}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

function UseCases() {
  const { t } = useLanguage()
  return (
    <section id="use-cases" className="usecases-section">
      <div className="container">
        <span className="eyebrow">{t.useCases.eyebrow}</span>
        <h2 className="section-title">{t.useCases.title}</h2>
        <p className="section-sub">{t.useCases.sub}</p>
        <div className="usecases-grid">
          {t.useCases.cards.map((u) => (
            <div className="usecase-card" key={u.icon}>
              <div className="usecase-icon"><Icon name={u.icon} /></div>
              <h4>{u.title}</h4>
              <p>{u.body}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

function Comparison() {
  const { t } = useLanguage()
  return (
    <section id="comparison">
      <div className="container">
        <span className="eyebrow">{t.comparison.eyebrow}</span>
        <h2 className="section-title">{t.comparison.title}</h2>
        <p className="section-sub">{t.comparison.sub}</p>
        <div className="usecases-grid why-grid">
          {t.comparison.cards.map((c) => (
            <div className="usecase-card" key={c.title}>
              <div className="usecase-icon"><Icon name={c.icon} /></div>
              <h4>{c.title}</h4>
              <p>{c.body}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

function Specs() {
  const { t } = useLanguage()
  return (
    <section id="specs" className="specs-section">
      <div className="container">
        <span className="eyebrow" style={{ background: 'rgba(0,212,255,0.15)' }}>{t.specs.eyebrow}</span>
        <h2 className="section-title">{t.specs.title}</h2>
        <p className="section-sub">{t.specs.sub}</p>
        <div className="specs-grid">
          {t.specs.cards.map((s) => (
            <div className="spec-card" key={s.label}>
              <div className="val">{s.val}</div>
              <div className="label">{s.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

function AboutUs() {
  const { t } = useLanguage()
  return (
    <section id="about">
      <div className="container about-grid">
        <div>
          <span className="eyebrow">{t.about.eyebrow}</span>
          <h2 className="section-title">{t.about.title}</h2>
          <p className="section-sub" style={{ marginBottom: 0 }}>{t.about.body}</p>
        </div>
        <div className="about-facts">
          {t.about.facts.map((f) => (
            <div className="info-row" key={f.label}>
              <span className="ico"><Icon name={f.icon} size={18} /></span>
              <div>
                <div className="t">{f.label}</div>
                <div className="d">{f.value}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

function Contact() {
  const { t } = useLanguage()
  const [submitted, setSubmitted] = useState(false)
  const [stage, setStage] = useState('')
  const f = t.contact.form
  const stageHint = f.stageOptions.find((o) => o.label === stage)?.hint

  function handleSubmit(e) {
    e.preventDefault()
    setSubmitted(true)
  }

  return (
    <section id="contact" className="contact-section">
      <div className="container contact-grid">
        <div className="contact-info">
          <span className="eyebrow">{t.contact.eyebrow}</span>
          <h2>{t.contact.title}</h2>
          <p>{t.contact.body}</p>
          <div className="info-row">
            <span className="ico"><Icon name="mail" size={18} /></span>
            <div>
              <div className="t">{t.contact.emailLabel}</div>
              <div className="d">{t.contact.email}</div>
            </div>
          </div>
          <div className="info-row">
            <span className="ico"><Icon name="pin" size={18} /></span>
            <div>
              <div className="t">{t.contact.locationLabel}</div>
              <div className="d">{t.contact.location}</div>
            </div>
          </div>
        </div>

        {submitted ? (
          <div className="form-success">{t.contact.success}</div>
        ) : (
          <form className="lead-form" onSubmit={handleSubmit}>
            <div className="form-two">
              <div className="form-row">
                <label htmlFor="name">{f.name}</label>
                <input id="name" type="text" placeholder={f.namePlaceholder} required />
              </div>
              <div className="form-row">
                <label htmlFor="company">{f.company}</label>
                <input id="company" type="text" placeholder={f.companyPlaceholder} required />
              </div>
            </div>
            <div className="form-two">
              <div className="form-row">
                <label htmlFor="email">{f.email}</label>
                <input id="email" type="email" placeholder={f.emailPlaceholder} required />
              </div>
              <div className="form-row">
                <label htmlFor="country">{f.country}</label>
                <select id="country" defaultValue="">
                  <option value="" disabled>{f.countryPlaceholder}</option>
                  {f.countries.map((g) => (
                    g.group ? (
                      <optgroup key={g.group} label={g.group}>
                        {g.options.map((o) => <option key={o}>{o}</option>)}
                      </optgroup>
                    ) : (
                      g.options.map((o) => <option key={o}>{o}</option>)
                    )
                  ))}
                </select>
              </div>
            </div>
            <div className="form-row">
              <label htmlFor="stage">{f.stage}</label>
              <select id="stage" value={stage} onChange={(e) => setStage(e.target.value)}>
                <option value="" disabled>{f.stagePlaceholder}</option>
                {f.stageOptions.map((o) => (
                  <option key={o.label} value={o.label}>{o.label}</option>
                ))}
              </select>
              {stageHint && <p className="field-hint">{stageHint}</p>}
            </div>
            <div className="form-row">
              <label htmlFor="message">{f.message}</label>
              <textarea id="message" rows="4" placeholder={f.messagePlaceholder} />
            </div>

            <details className="privacy-details">
              <summary>{t.contact.privacy.title}</summary>
              <p>{t.contact.privacy.summary}</p>
              <ul>
                {t.contact.privacy.points.map((p) => <li key={p}>{p}</li>)}
              </ul>
            </details>

            <label className="consent-row">
              <input
                type="checkbox"
                required
                onInvalid={(e) => e.target.setCustomValidity(t.contact.privacy.consentRequired)}
                onChange={(e) => e.target.setCustomValidity('')}
              />
              <span>{t.contact.privacy.consentLabel}</span>
            </label>

            <button type="submit" className="btn btn-dark" style={{ width: '100%' }}>
              {f.submit}
            </button>
          </form>
        )}
      </div>
    </section>
  )
}

function MadeInMexicoBadge() {
  return (
    <div className="mim-badge" role="img" aria-label="Hecho en México">
      <span className="mim-top">HECHO EN</span>
      <span className="mim-mx">MÉXICO</span>
      <span className="mim-flag" aria-hidden="true"><i /><i /><i /></span>
    </div>
  )
}

function Footer() {
  const { t } = useLanguage()
  return (
    <footer className="site-footer">
      <div className="container">
        <div className="footer-grid">
          <div className="footer-brand">
            <a href="#" className="logo">
              <span className="logo-mark" aria-hidden="true" />
              VeritX Vision
            </a>
            <p>{t.footer.tagline}</p>
            <MadeInMexicoBadge />
          </div>
          <div className="footer-cols">
            <div className="footer-col">
              <h5>{t.footer.product}</h5>
              {t.footer.productLinks.map((l) => (
                <a key={l.href} href={l.href}>{l.label}</a>
              ))}
            </div>
            <div className="footer-col">
              <h5>{t.footer.company}</h5>
              <span>{t.footer.about}</span>
              <span>{t.footer.careers}</span>
              <a href="#contact">{t.footer.contact}</a>
            </div>
            <div className="footer-col">
              <h5>{t.footer.legal}</h5>
              <span>{t.footer.privacy}</span>
              <span>{t.footer.terms}</span>
            </div>
          </div>
        </div>
        <div className="footer-bottom">
          <span>© {new Date().getFullYear()} VeritX Vision. {t.footer.rights}</span>
          <span>{t.footer.prototype}</span>
        </div>
      </div>
    </footer>
  )
}

function Site() {
  const route = useRoute()

  useEffect(() => {
    if (route === 'demo' || route === 'calculator') {
      window.scrollTo(0, 0)
    } else {
      const hash = window.location.hash
      if (hash && !hash.startsWith('#/')) {
        document.getElementById(hash.slice(1))?.scrollIntoView()
      }
    }
  }, [route])

  return (
    <>
      <Header />
      {route === 'demo' && <DemoPage />}
      {route === 'calculator' && <CalculatorPage />}
      {route === 'home' && (
        <>
          <Hero />
          <VisionA />
          <HowItWorks />
          <UseCases />
          <Comparison />
          <Specs />
          <AboutUs />
          <Contact />
        </>
      )}
      <Footer />
    </>
  )
}

export default function App() {
  return (
    <LanguageProvider>
      <Site />
    </LanguageProvider>
  )
}
