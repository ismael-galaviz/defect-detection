import { useMemo, useState } from 'react'
import { useLanguage } from './i18n.jsx'
import { Icon } from './icons.jsx'

// Defaults mirror the worked examples from the source ROI guide (Guia_Ingeniero_Calidad_ROI.docx).
const DEFAULTS = {
  defects: { rateBefore: 1.2, rateAfter: 0.2, volume: 500000, costPerDefect: 150 },
  laborHours: { hoursBefore: 12, hoursAfter: 2, hourlyCost: 80, shiftsPerYear: 250 },
  lineSpeed: { speedBefore: 70, speedAfter: 100, hoursPerYear: 4000, unitsPerMeter: 0.5, marginPerUnit: 20 },
}

const CALC = {
  defects: (v) => Math.max(0, v.rateBefore - v.rateAfter) / 100 * v.volume * v.costPerDefect,
  laborHours: (v) => Math.max(0, v.hoursBefore - v.hoursAfter) * v.hourlyCost * v.shiftsPerYear,
  lineSpeed: (v) => Math.max(0, v.speedAfter - v.speedBefore) * v.hoursPerYear * v.unitsPerMeter * v.marginPerUnit,
}

function formatMXN(n, lang) {
  return new Intl.NumberFormat(lang === 'es' ? 'es-MX' : 'en-US', {
    style: 'currency',
    currency: 'MXN',
    maximumFractionDigits: 0,
  }).format(Math.round(n) || 0)
}

// Shows thousand separators while at rest; switches to raw digits while focused so typing/cursor
// position isn't disturbed by live comma insertion.
function CalcNumberInput({ id, value, onChange }) {
  const { lang } = useLanguage()
  const [focused, setFocused] = useState(false)

  const display = focused
    ? String(value)
    : value === '' || value === null || value === undefined
      ? ''
      : Number(value).toLocaleString(lang === 'es' ? 'es-MX' : 'en-US', { maximumFractionDigits: 4 })

  return (
    <input
      id={id}
      type="text"
      inputMode="decimal"
      value={display}
      onFocus={() => setFocused(true)}
      onBlur={() => setFocused(false)}
      onChange={(e) => {
        const raw = e.target.value.replace(/,/g, '')
        if (raw === '' || /^\d*\.?\d*$/.test(raw)) onChange(raw)
      }}
    />
  )
}

function CalcSection({ section, values, onFieldChange, result, resultLabel, formulaLabel }) {
  return (
    <div className="calc-section">
      <div className="calc-section-header">
        <div className="calc-section-icon"><Icon name={section.icon} /></div>
        <div>
          <h3>{section.title}</h3>
          <p>{section.body}</p>
        </div>
      </div>

      <details className="calc-formula">
        <summary>{formulaLabel}</summary>
        <pre>{section.formula}</pre>
      </details>

      <div className="calc-fields">
        {section.fields.map((f) => (
          <div className="form-row" key={f.key}>
            <label htmlFor={`${section.id}-${f.key}`}>{f.label}</label>
            <CalcNumberInput
              id={`${section.id}-${f.key}`}
              value={values[f.key]}
              onChange={(val) => onFieldChange(f.key, val)}
            />
          </div>
        ))}
      </div>

      <div className="calc-result">
        <span>{resultLabel}</span>
        <strong>{result}</strong>
      </div>

      <p className="calc-hint">{section.hint}</p>
    </div>
  )
}

export default function CalculatorPage() {
  const { t, lang } = useLanguage()
  const c = t.calculatorPage
  const [values, setValues] = useState(() => JSON.parse(JSON.stringify(DEFAULTS)))

  function handleFieldChange(sectionId, key, val) {
    setValues((v) => ({ ...v, [sectionId]: { ...v[sectionId], [key]: val } }))
  }

  const results = useMemo(() => {
    const out = {}
    for (const s of c.sections) {
      const safe = Object.fromEntries(
        Object.entries(values[s.id]).map(([k, n]) => [k, Number(n) || 0])
      )
      out[s.id] = CALC[s.id](safe)
    }
    return out
  }, [values, c.sections])

  const totalAnnual = Object.values(results).reduce((a, b) => a + b, 0)

  return (
    <main>
      <section className="demo-hero">
        <div className="container">
          <span className="eyebrow">{c.eyebrow}</span>
          <h1>{c.title}</h1>
          <p className="lead">{c.intro}</p>
        </div>
      </section>

      <section className="demo-section">
        <div className="container">
          {c.sections.map((s) => (
            <CalcSection
              key={s.id}
              section={s}
              values={values[s.id]}
              onFieldChange={(key, val) => handleFieldChange(s.id, key, val)}
              result={formatMXN(results[s.id], lang)}
              resultLabel={c.resultLabel}
              formulaLabel={c.formulaLabel}
            />
          ))}

          <div className="calc-total">
            <h3>{c.totalTitle}</h3>
            <div className="calc-total-row calc-payback">
              <span>{c.totalAnnual}</span>
              <strong>{formatMXN(totalAnnual, lang)}</strong>
            </div>
          </div>

          <p className="calc-methodology">{c.methodologyNote}</p>

          <div className="calc-cta">
            <p>{c.ctaSub}</p>
            <a href="#contact" className="btn btn-primary">{c.cta}</a>
          </div>
        </div>
      </section>
    </main>
  )
}
