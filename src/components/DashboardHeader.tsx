import { color, SITE } from '../theme'
import { dateLabel, hms } from '../time'
import type { User } from '../types'
import { Wordmark } from './Wordmark'

interface Props {
  user: User | null
  now: Date
  onEndShift: () => void
}

export function DashboardHeader({ user, now, onEndShift }: Props) {
  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '14px 22px',
        borderBottom: '1px solid rgba(255,255,255,.06)',
        background: color.panelHeader,
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
        <Wordmark markSize={10} fontSize={15} letterSpacing="0.28em" />
        <div style={{ width: 1, height: 22, background: 'rgba(255,255,255,.1)' }} />
        <div>
          <div style={{ fontSize: 13, fontWeight: 600 }}>{SITE.name}</div>
          <div
            className="mono"
            style={{
              fontSize: 10,
              color: color.textMuted2,
              letterSpacing: '0.08em',
            }}
          >
            {SITE.addr} · MANAGER VIEW
          </div>
        </div>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: 18 }}>
        <div className="mono" style={{ textAlign: 'right' }}>
          <div style={{ fontSize: 18, fontWeight: 500, letterSpacing: '-0.01em' }}>
            {hms(now)}
          </div>
          <div style={{ fontSize: 10, color: color.textMuted2 }}>
            {dateLabel(now)}
          </div>
        </div>

        {/* user chip */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 9,
            padding: '6px 8px 6px 12px',
            border: '1px solid rgba(255,255,255,.09)',
            borderRadius: 10,
            background: 'rgba(255,255,255,.02)',
          }}
        >
          <div style={{ textAlign: 'right' }}>
            <div style={{ fontSize: 12, fontWeight: 600 }}>
              {user?.name ?? ''}
            </div>
            <div
              className="mono"
              style={{ fontSize: 9, color: color.green, letterSpacing: '0.05em' }}
            >
              ON SHIFT · {user?.clockIn ?? ''}
            </div>
          </div>
          <div
            style={{
              width: 30,
              height: 30,
              borderRadius: 8,
              background: 'rgba(63,216,138,.14)',
              color: color.green,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontWeight: 600,
              fontSize: 12,
            }}
          >
            {user?.initials ?? ''}
          </div>
          <button
            className="btn btn-endshift"
            onClick={onEndShift}
            style={{
              cursor: 'pointer',
              background: 'rgba(255,255,255,.04)',
              border: '1px solid rgba(255,255,255,.1)',
              color: color.textSecondary2,
              fontFamily: 'inherit',
              fontSize: 11,
              fontWeight: 500,
              padding: '7px 11px',
              borderRadius: 8,
            }}
          >
            End shift
          </button>
        </div>
      </div>
    </div>
  )
}
