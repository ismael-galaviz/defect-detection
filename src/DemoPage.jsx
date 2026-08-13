import { useMemo, useState } from 'react'
import { useLanguage } from './i18n.jsx'

// Validated against the navy map surface (#10294a): all-pairs CVD ΔE ≥ 9.4,
// normal-vision ΔE ≥ 20.9, contrast ≥ 3:1. "Other" is a neutral, not a slot.
const DEFECT_COLORS = {
  hole: '#3987e5',
  stain: '#d95926',
  weave: '#199e70',
  other: '#94a3b8',
}
const DEFECT_TYPES = Object.keys(DEFECT_COLORS)

const ROLL_LENGTH = 120 // meters
const FABRIC_WIDTH = 160 // cm
const SEVERITY_SIZE = { low: 10, medium: 14, high: 18 }

function generateDefects() {
  const weights = { hole: 0.3, stain: 0.3, weave: 0.25, other: 0.15 }
  const severities = ['low', 'medium', 'high']
  const count = 12 + Math.floor(Math.random() * 9)
  const defects = []
  for (let i = 0; i < count; i++) {
    const r = Math.random()
    let acc = 0
    let type = 'other'
    for (const key of DEFECT_TYPES) {
      acc += weights[key]
      if (r < acc) { type = key; break }
    }
    defects.push({
      x: +(Math.random() * ROLL_LENGTH).toFixed(1),
      y: Math.round(5 + Math.random() * (FABRIC_WIDTH - 10)),
      type,
      severity: severities[Math.floor(Math.random() * 3)],
      confidence: Math.round(88 + Math.random() * 11),
    })
  }
  return defects.sort((a, b) => a.x - b.x).map((d, i) => ({ ...d, id: i + 1 }))
}

const W = 760
const H = 380
const M = { top: 20, right: 20, bottom: 48, left: 58 }
const PW = W - M.left - M.right
const PH = H - M.top - M.bottom
const X_TICKS = [0, 20, 40, 60, 80, 100, 120]
const Y_TICKS = [0, 40, 80, 120, 160]

const sx = (x) => M.left + (x / ROLL_LENGTH) * PW
const sy = (y) => M.top + PH - (y / FABRIC_WIDTH) * PH

function DefectMap({ defects, hovered, setHovered }) {
  const { t } = useLanguage()
  return (
    <div className="map-svg-wrap">
      <svg viewBox={`0 0 ${W} ${H}`} role="img" aria-label={t.demo.title}>
        {/* gridlines */}
        {X_TICKS.map((v) => (
          <line key={`gx${v}`} x1={sx(v)} y1={M.top} x2={sx(v)} y2={M.top + PH} className="map-grid" />
        ))}
        {Y_TICKS.map((v) => (
          <line key={`gy${v}`} x1={M.left} y1={sy(v)} x2={M.left + PW} y2={sy(v)} className="map-grid" />
        ))}
        {/* axes */}
        <line x1={M.left} y1={M.top + PH} x2={M.left + PW} y2={M.top + PH} className="map-axis" />
        <line x1={M.left} y1={M.top} x2={M.left} y2={M.top + PH} className="map-axis" />
        {/* tick labels */}
        {X_TICKS.map((v) => (
          <text key={`tx${v}`} x={sx(v)} y={M.top + PH + 18} className="map-tick" textAnchor="middle">{v}</text>
        ))}
        {Y_TICKS.map((v) => (
          <text key={`ty${v}`} x={M.left - 10} y={sy(v) + 4} className="map-tick" textAnchor="end">{v}</text>
        ))}
        {/* axis titles */}
        <text x={M.left + PW / 2} y={H - 8} className="map-axis-title" textAnchor="middle">{t.demo.xAxis}</text>
        <text
          x={16}
          y={M.top + PH / 2}
          className="map-axis-title"
          textAnchor="middle"
          transform={`rotate(-90 16 ${M.top + PH / 2})`}
        >
          {t.demo.yAxis}
        </text>
        {/* defects */}
        {defects.map((d) => {
          const size = SEVERITY_SIZE[d.severity]
          return (
            <rect
              key={d.id}
              x={sx(d.x) - size / 2}
              y={sy(d.y) - size / 2}
              width={size}
              height={size}
              rx={2}
              fill={DEFECT_COLORS[d.type]}
              stroke="#10294a"
              strokeWidth={2}
              className={`map-defect${hovered?.id === d.id ? ' hovered' : ''}`}
              onMouseEnter={() => setHovered(d)}
              onMouseLeave={() => setHovered(null)}
            />
          )
        })}
      </svg>
      {hovered && (
        <div
          className="map-tooltip"
          style={{ left: `${(sx(hovered.x) / W) * 100}%`, top: `${(sy(hovered.y) / H) * 100}%` }}
        >
          <div className="tip-title">
            <i style={{ background: DEFECT_COLORS[hovered.type] }} />
            {t.demo.types[hovered.type]}
          </div>
          <div>{t.demo.tooltip.position}: <strong>{hovered.x} m</strong></div>
          <div>{t.demo.tooltip.width}: <strong>{hovered.y} cm</strong></div>
          <div>{t.demo.tooltip.severity}: <strong>{t.demo.severities[hovered.severity]}</strong></div>
          <div>{t.demo.tooltip.confidence}: <strong>{hovered.confidence}%</strong></div>
        </div>
      )}
    </div>
  )
}

export default function DemoPage() {
  const { t } = useLanguage()
  const [defects, setDefects] = useState(generateDefects)
  const [hovered, setHovered] = useState(null)

  const counts = useMemo(() => {
    const c = {}
    for (const d of defects) c[d.type] = (c[d.type] || 0) + 1
    return c
  }, [defects])

  return (
    <main>
      <section className="demo-hero">
        <div className="container">
          <span className="eyebrow">{t.demo.eyebrow}</span>
          <h1>{t.demo.title}</h1>
          <p className="lead">{t.demo.sub}</p>
          <div className="demo-toolbar">
            <button
              type="button"
              className="btn btn-primary"
              onClick={() => { setDefects(generateDefects()); setHovered(null) }}
            >
              {t.demo.simulate}
            </button>
            <span className="demo-meta">
              {t.demo.rollInfo} · <strong>{defects.length}</strong> {t.demo.defectsDetected}
            </span>
          </div>
        </div>
      </section>

      <section className="demo-section">
        <div className="container">
          <div className="map-card">
            <div className="map-legend">
              {DEFECT_TYPES.map((type) => (
                <span className="legend-item" key={type}>
                  <i style={{ background: DEFECT_COLORS[type] }} />
                  {t.demo.types[type]} ({counts[type] || 0})
                </span>
              ))}
              <span className="legend-note">{t.demo.sizeNote}</span>
            </div>
            <DefectMap defects={defects} hovered={hovered} setHovered={setHovered} />
          </div>

          <div className="defect-table-card">
            <h3>{t.demo.table.title}</h3>
            <div className="defect-table-wrap">
              <table className="defect-table">
                <thead>
                  <tr>
                    {t.demo.table.cols.map((c) => <th key={c}>{c}</th>)}
                  </tr>
                </thead>
                <tbody>
                  {defects.map((d) => (
                    <tr
                      key={d.id}
                      className={hovered?.id === d.id ? 'row-hovered' : ''}
                      onMouseEnter={() => setHovered(d)}
                      onMouseLeave={() => setHovered(null)}
                    >
                      <td>{d.id}</td>
                      <td>{d.x}</td>
                      <td>{d.y}</td>
                      <td>
                        <span className="type-cell">
                          <i style={{ background: DEFECT_COLORS[d.type] }} />
                          {t.demo.types[d.type]}
                        </span>
                      </td>
                      <td>{t.demo.severities[d.severity]}</td>
                      <td>{d.confidence}%</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </section>
    </main>
  )
}
