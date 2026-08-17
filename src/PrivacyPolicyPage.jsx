import { useLanguage } from './i18n.jsx'

export default function PrivacyPolicyPage() {
  const { t } = useLanguage()
  const p = t.privacyPage
  return (
    <main>
      <section className="demo-hero">
        <div className="container">
          <span className="eyebrow">{p.eyebrow}</span>
          <h1>{p.title}</h1>
          <p className="lead">{p.updated}</p>
        </div>
      </section>

      <section className="demo-section">
        <div className="container legal-content">
          <p>{p.intro}</p>
          {p.sections.map((s) => (
            <div key={s.heading}>
              <h2>{s.heading}</h2>
              {s.body && <p>{s.body}</p>}
              {s.items && (
                <ul>
                  {s.items.map((item) => <li key={item}>{item}</li>)}
                </ul>
              )}
            </div>
          ))}
        </div>
      </section>
    </main>
  )
}
