import { lockBioVisuals, overlaySubText } from '../bioVisuals'
import { color } from '../theme'
import { useMobile } from '../MobileContext'
import type { BioMode, BioStep } from '../types'

interface Props {
  mode: BioMode
  step: BioStep
  onCancel: () => void
  /** Fresh-scan trigger. On phones the ring itself is the tap target. */
  onScan?: () => void
}

/** End-shift / acknowledge confirm modal — forces a fresh fingerprint scan. */
export function BioOverlay({ mode, step, onCancel, onScan }: Props) {
  const scanning = step === 'scanning'
  const bio = lockBioVisuals(step)
  const tag = mode === 'ack' ? 'ALERT · ACKNOWLEDGE' : 'SHIFT · CLOCK-OUT'
  const title = mode === 'ack' ? 'Acknowledge alert' : 'End your shift'
  const mobile = useMobile()
  const ringTappable = mobile && step === 'idle'

  return (
    <div
      style={{
        position: mobile ? 'fixed' : 'absolute',
        inset: 0,
        zIndex: 50,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'rgba(4,7,9,.72)',
        backdropFilter: 'blur(3px)',
      }}
    >
      <div
        style={{
          width: 400,
          border: '1px solid rgba(255,255,255,.1)',
          borderRadius: 16,
          background: '#0d1418',
          padding: 28,
          textAlign: 'center',
          boxShadow: '0 30px 80px rgba(0,0,0,.6)',
        }}
      >
        <div
          className="mono"
          style={{ fontSize: 10, letterSpacing: '0.2em', color: color.green }}
        >
          {tag}
        </div>
        <div style={{ fontSize: 19, fontWeight: 700, marginTop: 10 }}>
          {title}
        </div>

        <div
          onClick={ringTappable ? onScan : undefined}
          role={ringTappable ? 'button' : undefined}
          style={{
            margin: '22px auto 0',
            width: 120,
            height: 120,
            borderRadius: '50%',
            position: 'relative',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: '#0b1114',
            border: '1px solid rgba(255,255,255,.08)',
            cursor: ringTappable ? 'pointer' : 'default',
          }}
        >
          {scanning && (
            <span
              style={{
                position: 'absolute',
                inset: -3,
                borderRadius: '50%',
                border: '2px solid rgba(63,216,138,.5)',
                animation: 'ringpulse 1.6s infinite',
              }}
            />
          )}
          <div
            style={{
              width: 84,
              height: 84,
              borderRadius: '50%',
              border: '2px solid',
              ...bio.ringStyle,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <div
              className="mono"
              style={{ fontSize: 11, letterSpacing: '0.1em', color: '#9aa7ad' }}
            >
              {bio.centerText}
            </div>
          </div>
        </div>

        <div
          className="mono"
          style={{
            fontSize: 12,
            color: color.textMuted,
            marginTop: 18,
            lineHeight: 1.5,
          }}
        >
          {ringTappable ? 'Tap the reader above to confirm.' : overlaySubText(step)}
        </div>

        <button
          className="btn btn-cancel"
          onClick={onCancel}
          style={{
            marginTop: 20,
            cursor: 'pointer',
            background: 'rgba(255,255,255,.05)',
            border: '1px solid rgba(255,255,255,.12)',
            color: color.textSecondary2,
            fontFamily: 'inherit',
            fontSize: 12,
            fontWeight: 500,
            padding: '9px 20px',
            borderRadius: 9,
          }}
        >
          Cancel
        </button>
      </div>
    </div>
  )
}
