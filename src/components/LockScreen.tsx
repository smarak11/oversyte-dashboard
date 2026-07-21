import { lockBioVisuals } from '../bioVisuals'
import { color, SITE } from '../theme'
import { dateLabel, hms } from '../time'
import type { TerminalState } from '../terminalReducer'
import { Wordmark } from './Wordmark'

interface Props {
  state: TerminalState
  now: Date
}

export function LockScreen({ state, now }: Props) {
  const scanning = state.bioStep === 'scanning'
  const bio = lockBioVisuals(state.bioStep)

  return (
    <div
      style={{
        position: 'absolute',
        inset: 0,
        zIndex: 40,
        display: 'flex',
        flexDirection: 'column',
        background:
          'radial-gradient(900px 600px at 70% 40%,#0e1620 0%,#080b0d 75%)',
      }}
    >
      {/* top bar */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          padding: '26px 34px',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <Wordmark markSize={11} letterSpacing="0.34em" fontSize={16} gap={12} />
          <span
            className="mono"
            style={{
              color: color.textFaint,
              fontSize: 11,
              letterSpacing: '0.15em',
              marginLeft: 6,
            }}
          >
            ON-SITE TERMINAL
          </span>
        </div>
        <div
          className="mono"
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 8,
            color: color.textMuted2,
            fontSize: 12,
          }}
        >
          <span
            style={{
              width: 7,
              height: 7,
              borderRadius: '50%',
              background: color.green,
              animation: 'blink 2s infinite',
            }}
          />
          SYSTEM · NOMINAL
        </div>
      </div>

      {/* center */}
      <div
        style={{
          flex: 1,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 80,
          padding: '0 60px',
        }}
      >
        <div style={{ maxWidth: 440 }}>
          <div
            className="mono"
            style={{
              color: color.green,
              fontSize: 12,
              letterSpacing: '0.22em',
              marginBottom: 18,
            }}
          >
            {dateLabel(now)}
          </div>
          <div
            className="mono"
            style={{
              fontSize: 88,
              fontWeight: 500,
              lineHeight: 1,
              letterSpacing: '-0.02em',
            }}
          >
            {hms(now)}
          </div>
          <div style={{ marginTop: 26, fontSize: 20, fontWeight: 600 }}>
            {SITE.name}
          </div>
          <div style={{ color: color.textMuted2, fontSize: 13, marginTop: 4 }}>
            {SITE.addr} · 8 cameras connected
          </div>

          {/* prompt card */}
          <div
            style={{
              marginTop: 34,
              padding: '16px 20px',
              border: '1px solid rgba(255,255,255,.09)',
              borderRadius: 12,
              background: 'rgba(255,255,255,.02)',
              display: 'flex',
              gap: 14,
              alignItems: 'center',
              maxWidth: 380,
            }}
          >
            <div
              style={{
                width: 34,
                height: 34,
                borderRadius: 9,
                background: 'rgba(63,216,138,.12)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0,
              }}
            >
              <div
                style={{
                  width: 11,
                  height: 11,
                  border: `2px solid ${color.green}`,
                  borderRadius: 3,
                }}
              />
            </div>
            <div>
              <div style={{ fontWeight: 600, fontSize: 13 }}>
                {bio.promptTitle}
              </div>
              <div
                style={{ color: color.textMuted2, fontSize: 12, marginTop: 2 }}
              >
                {bio.promptSub}
              </div>
            </div>
          </div>
        </div>

        {/* biometric status column */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: 22,
            width: 300,
          }}
        >
          <div
            className="mono"
            style={{
              color: color.textFaint,
              fontSize: 11,
              letterSpacing: '0.2em',
            }}
          >
            BIOMETRIC IDENTITY
          </div>
          <div
            style={{
              width: 170,
              height: 170,
              borderRadius: '50%',
              position: 'relative',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              background: '#0b1114',
              border: '1px solid rgba(255,255,255,.08)',
            }}
          >
            {scanning && (
              <span
                style={{
                  position: 'absolute',
                  inset: -2,
                  borderRadius: '50%',
                  border: '2px solid rgba(63,216,138,.5)',
                  animation: 'ringpulse 1.6s infinite',
                }}
              />
            )}
            <div
              style={{
                width: 120,
                height: 120,
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                position: 'relative',
              }}
            >
              <div
                style={{
                  position: 'absolute',
                  inset: 0,
                  borderRadius: '50%',
                  border: '2px solid',
                  ...bio.ringStyle,
                }}
              />
              <div
                className="mono"
                style={{
                  fontSize: 11,
                  letterSpacing: '0.12em',
                  textAlign: 'center',
                  color: '#9aa7ad',
                }}
              >
                {bio.centerText}
              </div>
            </div>
          </div>
          <div
            className="mono"
            style={{
              fontSize: 12,
              color: color.textMuted2,
              textAlign: 'center',
              minHeight: 34,
              lineHeight: 1.5,
              whiteSpace: 'pre-line',
            }}
          >
            {bio.statusText}
          </div>
        </div>
      </div>

      {/* bottom bar */}
      <div
        className="mono"
        style={{
          padding: '20px 34px',
          display: 'flex',
          justifyContent: 'space-between',
          color: color.textFaint2,
          fontSize: 11,
          borderTop: '1px solid rgba(255,255,255,.05)',
        }}
      >
        <span>OVERSYTE ID READER · DOCKED</span>
        <span>PHASE 1 · SECURITY &amp; SHIFT VERIFICATION</span>
      </div>
    </div>
  )
}
