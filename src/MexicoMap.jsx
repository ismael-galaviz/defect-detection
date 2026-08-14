import { MX_WIDTH, MX_HEIGHT, MX_OTHER_STATES, MX_NEIGHBOR_STATES, MX_HIGHLIGHT_STATE } from './mexicoMapData.js'

// Manual label-position nudges: Puebla's area-weighted centroid lands almost on top of
// Tlaxcala (Puebla wraps around most of it), so raw centroids would collide. These push each
// neighbor's label into open space inside its own territory instead.
const LABEL_OFFSET = {
  Puebla: { x: 24, y: 24 },
  México: { x: -10, y: 2 },
  Hidalgo: { x: -2, y: -12 },
}

export default function MexicoMap() {
  return (
    <svg
      className="mx-map"
      viewBox={`0 0 ${MX_WIDTH} ${MX_HEIGHT}`}
      role="img"
      aria-label="Map of Mexico with Tlaxcala highlighted"
    >
      <g className="mx-other">
        {MX_OTHER_STATES.map((s) => (
          <path key={s.name} d={s.d}>
            <title>{s.name}</title>
          </path>
        ))}
      </g>
      <g className="mx-neighbors">
        {MX_NEIGHBOR_STATES.map((s) => (
          <path key={s.name} d={s.d}>
            <title>{s.name}</title>
          </path>
        ))}
      </g>
      <path className="mx-highlight" d={MX_HIGHLIGHT_STATE.d}>
        <title>{MX_HIGHLIGHT_STATE.name}</title>
      </path>

      <g className="mx-marker" transform={`translate(${MX_HIGHLIGHT_STATE.cx} ${MX_HIGHLIGHT_STATE.cy})`}>
        <circle className="mx-marker-ring" r="10" />
        <circle className="mx-marker-dot" r="4" />
      </g>

      <g className="mx-labels">
        {MX_NEIGHBOR_STATES.map((s) => {
          const off = LABEL_OFFSET[s.name] || { x: 0, y: 0 }
          return (
            <text key={s.name} x={s.cx + off.x} y={s.cy + off.y}>
              {s.name}
            </text>
          )
        })}
      </g>
    </svg>
  )
}
