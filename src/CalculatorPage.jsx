import { useLanguage } from './i18n.jsx'

export default function CalculatorPage() {
  const { t } = useLanguage()
  return (
    <main>
      <section className="demo-hero">
        <div className="container">
          <span className="eyebrow">{t.calculatorPage.eyebrow}</span>
          <h1>{t.calculatorPage.title}</h1>
        </div>
      </section>

      <section className="demo-section">
        <div className="container">
          <div className="placeholder-card">
            <div className="placeholder-icon" aria-hidden="true">
              <svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                <rect x="4" y="3" width="16" height="18" rx="2" />
                <path d="M8 7h8M8 11h2M12 11h2M16 11h0M8 15h2M12 15h2M16 15h0" />
              </svg>
            </div>
            <p className="placeholder-body">{t.calculatorPage.body}</p>
            <a href="#contact" className="btn btn-primary">{t.calculatorPage.cta}</a>
          </div>
        </div>
      </section>
    </main>
  )
}
