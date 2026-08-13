import { useLanguage } from './i18n.jsx'
import { Icon } from './icons.jsx'

export default function AboutPage() {
  const { t } = useLanguage()
  return (
    <main>
      <section className="demo-hero">
        <div className="container">
          <span className="eyebrow">{t.about.eyebrow}</span>
          <h1>{t.about.title}</h1>
        </div>
      </section>

      <section className="demo-section">
        <div className="container about-grid">
          <p className="section-sub" style={{ marginBottom: 0 }}>{t.about.body}</p>
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
    </main>
  )
}
