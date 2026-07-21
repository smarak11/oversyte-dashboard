import type { CSSProperties } from 'react'
import { color } from '../theme'
import type { ActivityEvent, ClipData, User } from '../types'
import { ActivityItem } from './ActivityItem'

interface Props {
  user: User | null
  events: ActivityEvent[]
  activeAlerts: number
  onViewClip: (clip: ClipData) => void
}

interface Metric {
  label: string
  value: string
  sub: string
  valStyle?: CSSProperties
  wrapStyle?: CSSProperties
}

export function RightRail({ user, events, activeAlerts, onViewClip }: Props) {
  const metrics: Metric[] = [
    {
      label: 'CAMERAS ONLINE',
      value: '8/8',
      sub: 'Recording · 24/7',
      valStyle: { color: color.green },
      wrapStyle: { borderColor: 'rgba(63,216,138,.2)' },
    },
    {
      label: 'LOSS PREVENTED · TODAY',
      value: '$186',
      sub: 'Est. shrinkage avoided',
    },
    {
      label: 'ACTIVE ALERTS',
      value: String(activeAlerts),
      sub: activeAlerts ? 'Needs acknowledgement' : 'All clear',
      valStyle: { color: activeAlerts ? color.red : color.green },
      wrapStyle: activeAlerts ? { borderColor: 'rgba(255,81,69,.3)' } : undefined,
    },
    {
      label: 'SYSTEM STATUS',
      value: 'Nominal',
      sub: 'Detection nominal',
      valStyle: { color: color.green, fontSize: 19 },
    },
  ]

  return (
    <div
      style={{
        width: 352,
        flexShrink: 0,
        borderLeft: '1px solid rgba(255,255,255,.06)',
        background: color.panelRail,
        display: 'flex',
        flexDirection: 'column',
        minHeight: 0,
      }}
    >
      {/* metrics */}
      <div
        style={{
          padding: '16px 16px 6px',
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: 9,
        }}
      >
        {metrics.map((m) => (
          <MetricCard key={m.label} metric={m} />
        ))}
      </div>

      {/* shift verification */}
      <div
        style={{
          margin: '10px 16px 4px',
          border: '1px solid rgba(63,216,138,.22)',
          borderRadius: 12,
          padding: 13,
          background: 'rgba(63,216,138,.05)',
        }}
      >
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <span
            className="mono"
            style={{ fontSize: 10, letterSpacing: '0.1em', color: color.green }}
          >
            SHIFT VERIFICATION
          </span>
          <span
            className="mono"
            style={{
              fontSize: 9,
              color: color.green,
              display: 'flex',
              alignItems: 'center',
              gap: 4,
            }}
          >
            <span
              style={{
                width: 6,
                height: 6,
                borderRadius: '50%',
                background: color.green,
              }}
            />
            MATCHED
          </span>
        </div>
        <div style={{ marginTop: 9, fontSize: 13, fontWeight: 600 }}>
          {user?.name ?? ''} · {user?.role ?? ''}
        </div>
        <div
          className="mono"
          style={{
            fontSize: 10,
            color: '#9aa7ad',
            marginTop: 3,
            lineHeight: 1.5,
          }}
        >
          Biometric clock-in {user?.clockIn ?? ''} auto-confirmed against
          camera-observed presence at register.
        </div>
      </div>

      {/* activity timeline */}
      <div
        style={{
          padding: '14px 16px 6px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        <span style={{ fontWeight: 600, fontSize: 13 }}>Live Activity</span>
        <span className="mono" style={{ fontSize: 10, color: color.textMuted2 }}>
          PAST 4 HOURS
        </span>
      </div>
      <div
        style={{
          flex: 1,
          overflowY: 'auto',
          padding: '0 16px 16px',
          minHeight: 0,
        }}
      >
        {events.map((e, i) => (
          <ActivityItem
            key={`${e.time}-${e.title}-${i}`}
            event={e}
            onViewClip={onViewClip}
          />
        ))}
      </div>
    </div>
  )
}

function MetricCard({ metric }: { metric: Metric }) {
  return (
    <div
      style={{
        border: '1px solid rgba(255,255,255,.07)',
        borderRadius: 11,
        padding: '12px 13px',
        background: 'rgba(255,255,255,.02)',
        ...metric.wrapStyle,
      }}
    >
      <div
        className="mono"
        style={{ fontSize: 9, letterSpacing: '0.1em', color: color.textMuted2 }}
      >
        {metric.label}
      </div>
      <div
        className="mono"
        style={{ fontSize: 23, fontWeight: 600, marginTop: 5, ...metric.valStyle }}
      >
        {metric.value}
      </div>
      <div style={{ fontSize: 10, color: color.textMuted2, marginTop: 1 }}>
        {metric.sub}
      </div>
    </div>
  )
}
