import { useLanguage } from './i18n.jsx'
import { Icon } from './icons.jsx'
import MexicoMap from './MexicoMap.jsx'

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
            <div className="about-map">
              <MexicoMap />
              <div className="about-map-caption">
                <span className="about-map-dot" aria-hidden="true" />
                Tlaxcala
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="demo-section vm-section">
        <div className="container vm-grid">
          <div className="vm-card">
            <div className="vf-icon"><Icon name={t.about.vision.icon} /></div>
            <h3>{t.about.vision.title}</h3>
            <p>{t.about.vision.body}</p>
          </div>
          <div className="vm-card">
            <div className="vf-icon"><Icon name={t.about.mission.icon} /></div>
            <h3>{t.about.mission.title}</h3>
            <p>{t.about.mission.body}</p>
          </div>
        </div>
      </section>
    </main>
  )
}
