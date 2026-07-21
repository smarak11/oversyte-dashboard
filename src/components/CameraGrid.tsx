import { CAMERA_DEFS, FLAGGED_CAMERA_INDEX, RECORDING } from '../data'
import { color } from '../theme'
import type { CameraDef } from '../types'
import { CameraTile } from './CameraTile'

interface Props {
  /** Whether the demo theft alert is active (flags CAM 03). */
  flagActive: boolean
  /** Open the detailed pop-out for a camera. */
  onOpenCamera: (cam: CameraDef, flagged: boolean) => void
}

export function CameraGrid({ flagActive, onOpenCamera }: Props) {
  return (
    <div
      style={{
        flex: 1,
        padding: 18,
        display: 'flex',
        flexDirection: 'column',
        minWidth: 0,
      }}
    >
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: 12,
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <span style={{ fontWeight: 600, fontSize: 13 }}>
            Live Camera Intelligence
          </span>
          <span
            className="mono"
            style={{
              fontSize: 10,
              color: color.green,
              padding: '2px 7px',
              border: '1px solid rgba(63,216,138,.3)',
              borderRadius: 20,
              background: 'rgba(63,216,138,.08)',
            }}
          >
            8/8 ONLINE
          </span>
        </div>
        <span className="mono" style={{ fontSize: 10, color: color.textMuted2 }}>
          AI MONITORING · ALL FEEDS
        </span>
      </div>

      <div
        style={{
          flex: 1,
          display: 'grid',
          gridTemplateColumns: 'repeat(3,1fr)',
          gridAutoRows: 'auto',
          gap: 10,
          minHeight: 0,
          alignContent: 'center',
          alignItems: 'start',
        }}
      >
        {CAMERA_DEFS.map((cam, i) => {
          const flagged = flagActive && i === FLAGGED_CAMERA_INDEX
          return (
            <CameraTile
              key={cam.label}
              cam={cam}
              flagged={flagged}
              index={i}
              onOpen={() => onOpenCamera(cam, flagged)}
            />
          )
        })}

        <AiDetectionTile />
      </div>
    </div>
  )
}

function AiDetectionTile() {
  return (
    <div
      style={{
        position: 'relative',
        border: '1px solid rgba(63,216,138,.2)',
        borderRadius: 11,
        overflow: 'hidden',
        background: 'linear-gradient(180deg,#0c1518,#0a1012)',
        padding: 13,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
      }}
    >
      <div>
        <div
          className="mono"
          style={{
            fontSize: 9,
            color: color.green,
            letterSpacing: '0.12em',
            display: 'flex',
            alignItems: 'center',
            gap: 5,
          }}
        >
          <span
            style={{
              width: 6,
              height: 6,
              borderRadius: '50%',
              background: color.green,
              boxShadow: `0 0 8px ${color.green}`,
            }}
          />
          AI DETECTION
        </div>
        <div
          style={{
            fontSize: 13,
            fontWeight: 600,
            marginTop: 6,
            color: color.textPrimary,
          }}
        >
          All feeds monitored
        </div>
      </div>
      <div
        className="mono"
        style={{
          fontSize: 9,
          color: color.textMuted,
          lineHeight: 1.3,
          marginTop: 8,
          display: 'flex',
          flexDirection: 'column',
          gap: 6,
        }}
      >
        <Stat label="MODELS" value="3 ACTIVE" />
        <Stat label="LATENCY" value="4.2s AVG" />
        <Stat label="RECORDING" value={`${RECORDING.duty} · 8/8`} valueColor={color.green} />
      </div>
    </div>
  )
}

function Stat({
  label,
  value,
  valueColor,
}: {
  label: string
  value: string
  valueColor?: string
}) {
  return (
    <div>
      <div style={{ color: color.textFaint }}>{label}</div>
      <div style={{ color: valueColor ?? color.textSecondary }}>{value}</div>
    </div>
  )
}
