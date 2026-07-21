import { readerVisuals } from '../bioVisuals'
import { color } from '../theme'
import type { BioMode, BioStep } from '../types'

interface Props {
  bioStep: BioStep
  bioMode: BioMode
  onTap: () => void
}

/**
 * The docked biometric reader module attached to the tablet's right edge.
 * In production this mirrors the physical fingerprint hardware; tapping it
 * simulates a successful scan.
 */
export function ReaderModule({ bioStep, bioMode, onTap }: Props) {
  const scanning = bioStep === 'scanning'
  const v = readerVisuals(bioStep, bioMode)

  return (
    <div
      style={{
        width: 150,
        height: 824,
        marginLeft: -6,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        background: color.tabletBody,
        borderRadius: '0 22px 22px 0',
        padding: '26px 16px',
        boxShadow:
          '0 40px 120px rgba(0,0,0,.6),inset 0 0 0 1px rgba(255,255,255,.03)',
        position: 'relative',
        zIndex: 2,
      }}
    >
      <div
        className="mono"
        style={{
          fontSize: 9,
          letterSpacing: '0.18em',
          color: color.textFaint,
          textAlign: 'center',
        }}
      >
        OVERSYTE
        <br />
        <span style={{ color: color.green }}>ID READER</span>
      </div>

      <div style={{ flex: 1, display: 'flex', alignItems: 'center' }}>
        <button
          onClick={onTap}
          style={{
            cursor: 'pointer',
            background: 'none',
            border: 'none',
            padding: 0,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: 20,
          }}
        >
          <div
            style={{
              width: 100,
              height: 100,
              borderRadius: '50%',
              position: 'relative',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              background: '#070b0d',
              border: '1px solid rgba(255,255,255,.06)',
              ...v.outer,
            }}
          >
            {scanning && (
              <>
                <span
                  style={{
                    position: 'absolute',
                    inset: -4,
                    borderRadius: '50%',
                    border: '2px solid rgba(63,216,138,.55)',
                    animation: 'ringpulse 1.5s infinite',
                  }}
                />
                <span
                  style={{
                    position: 'absolute',
                    left: '14%',
                    right: '14%',
                    height: 2,
                    background:
                      'linear-gradient(90deg,transparent,#3fd88a,transparent)',
                    animation: 'scanline 1.5s linear infinite',
                    boxShadow: `0 0 8px ${color.green}`,
                  }}
                />
              </>
            )}
            <div
              style={{
                width: 66,
                height: 66,
                borderRadius: '50%',
                border: '2px solid rgba(255,255,255,.1)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                ...v.ring,
              }}
            >
              <div
                style={{
                  width: 38,
                  height: 38,
                  borderRadius: '50%',
                  border: '1.5px solid rgba(255,255,255,.08)',
                  ...v.inner,
                }}
              />
            </div>
          </div>
          <div
            className="mono"
            style={{
              fontSize: 9,
              color: color.textMuted2,
              textAlign: 'center',
              letterSpacing: '0.06em',
              lineHeight: 1.5,
              maxWidth: 120,
              minHeight: 40,
            }}
          >
            {v.label}
          </div>
        </button>
      </div>

      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: 7,
        }}
      >
        <div style={{ width: 9, height: 9, borderRadius: '50%', ...v.led }} />
        <div
          className="mono"
          style={{ fontSize: 8, color: color.textFaint2, letterSpacing: '0.14em' }}
        >
          {v.ledLabel}
        </div>
      </div>
    </div>
  )
}
