import { color } from '../theme'
import type { Alert } from '../types'

interface Props {
  alert: Alert
  onAck: () => void
  onViewClip: () => void
}

export function AlertBanner({ alert, onAck, onViewClip }: Props) {
  return (
    <div
      style={{
        animation: 'bannerin .4s ease',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: 18,
        padding: '13px 22px',
        background:
          'linear-gradient(90deg,rgba(255,81,69,.22),rgba(255,81,69,.08))',
        borderBottom: '1px solid rgba(255,81,69,.4)',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
        <div
          style={{
            width: 30,
            height: 30,
            borderRadius: 8,
            background: color.red,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0,
          }}
        >
          {/* "!" glyph drawn in CSS */}
          <div
            style={{
              width: 4,
              height: 12,
              background: color.screen,
              borderRadius: 2,
              boxShadow: `0 6px 0 -1px ${color.screen}`,
            }}
          />
        </div>
        <div>
          <div style={{ fontWeight: 700, fontSize: 14, color: color.redTextLight }}>
            CRITICAL · {alert.type}
          </div>
          <div className="mono" style={{ fontSize: 11, color: color.redTextMuted }}>
            {alert.loc} · {alert.cam} · {alert.conf}% AI confidence · {alert.time}
          </div>
        </div>
      </div>

      <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
        <button
          className="btn btn-subtle"
          onClick={onViewClip}
          style={{
            cursor: 'pointer',
            background: 'rgba(255,255,255,.06)',
            border: '1px solid rgba(255,255,255,.14)',
            color: '#fff',
            fontFamily: 'inherit',
            fontSize: 12,
            fontWeight: 500,
            padding: '9px 14px',
            borderRadius: 9,
          }}
        >
          View clip
        </button>
        <button
          className="btn btn-ack"
          onClick={onAck}
          style={{
            cursor: 'pointer',
            background: color.red,
            border: 'none',
            color: color.screen,
            fontFamily: 'inherit',
            fontSize: 12,
            fontWeight: 700,
            padding: '9px 16px',
            borderRadius: 9,
          }}
        >
          Acknowledge on reader →
        </button>
      </div>
    </div>
  )
}
