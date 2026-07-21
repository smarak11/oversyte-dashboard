import { color } from '../theme'
import type { ActivityEvent, ClipData, Severity } from '../types'

const dotColor: Record<Severity, string> = {
  crit: color.red,
  warn: color.amber,
  ok: color.green,
  info: color.infoGray,
}

interface Props {
  event: ActivityEvent
  onViewClip: (clip: ClipData) => void
}

export function ActivityItem({ event, onViewClip }: Props) {
  const col = dotColor[event.sev]

  const openClip = () =>
    onViewClip({
      cam: event.cam ?? 'CAM 03',
      loc: event.loc ?? 'Aisle 2',
      type: event.title,
      conf: event.conf,
      time: event.time,
    })
  return (
    <div
      style={{
        animation: 'fadein .35s ease',
        display: 'flex',
        gap: 11,
        padding: '11px 0',
        borderBottom: '1px solid rgba(255,255,255,.05)',
      }}
    >
      <div
        className="mono"
        style={{
          fontSize: 10,
          color: color.textMuted2,
          width: 38,
          flexShrink: 0,
          paddingTop: 2,
        }}
      >
        {event.time}
      </div>
      <div
        style={{
          width: 9,
          flexShrink: 0,
          display: 'flex',
          justifyContent: 'center',
          paddingTop: 5,
        }}
      >
        <span
          style={{
            width: 8,
            height: 8,
            borderRadius: '50%',
            background: col,
            boxShadow: `0 0 8px ${col}`,
          }}
        />
      </div>
      <div style={{ minWidth: 0 }}>
        <div
          style={{
            fontSize: 12,
            fontWeight: 600,
            color: event.sev === 'crit' ? color.redTextLight : undefined,
          }}
        >
          {event.title}
        </div>
        <div
          style={{
            fontSize: 11,
            color: color.textMuted,
            marginTop: 2,
            lineHeight: 1.45,
          }}
        >
          {event.desc}
        </div>
        {(event.conf != null || event.clip) && (
          <div style={{ display: 'flex', gap: 7, marginTop: 6 }}>
            {event.conf != null && (
              <span
                className="mono"
                style={{
                  fontSize: 9,
                  color: color.textSecondary2,
                  background: 'rgba(255,255,255,.06)',
                  padding: '2px 6px',
                  borderRadius: 5,
                }}
              >
                {event.conf}% CONF
              </span>
            )}
            {event.clip && (
              <button
                className="btn"
                onClick={openClip}
                style={{
                  cursor: 'pointer',
                  fontFamily: "'JetBrains Mono', monospace",
                  fontSize: 9,
                  color: color.green,
                  background: 'rgba(63,216,138,.1)',
                  border: '1px solid rgba(63,216,138,.25)',
                  padding: '2px 6px',
                  borderRadius: 5,
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = 'rgba(63,216,138,.2)'
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = 'rgba(63,216,138,.1)'
                }}
              >
                ▶ CLIP 00:05
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
