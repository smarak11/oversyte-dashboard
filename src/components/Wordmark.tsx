import { color } from '../theme'

interface Props {
  markSize?: number
  fontSize?: number
  letterSpacing?: string
  gap?: number
}

/** The Oversyte logo lockup: a glowing green square mark + wordmark. */
export function Wordmark({
  markSize = 10,
  fontSize = 15,
  letterSpacing = '0.28em',
  gap = 9,
}: Props) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap }}>
      <div
        style={{
          width: markSize,
          height: markSize,
          borderRadius: 3,
          background: color.green,
          boxShadow: `0 0 ${markSize + 1}px ${color.green}`,
        }}
      />
      <span style={{ fontWeight: 700, letterSpacing, fontSize }}>OVERSYTE</span>
    </div>
  )
}
