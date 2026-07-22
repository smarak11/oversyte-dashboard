import { useState } from 'react'
import { lockBioVisuals, readerVisuals } from '../bioVisuals'
import {
  CAMERA_DEFS,
  FLAGGED_CAMERA_INDEX,
  RECORDING,
} from '../data'
import { MobileContext } from '../MobileContext'
import { useViewport } from '../useViewport'
import { activeAlertCount } from '../terminalReducer'
import type { TerminalState } from '../terminalReducer'
import { color, SITE } from '../theme'
import { dateLabel, hms } from '../time'
import type { ClipData } from '../types'
import { Wordmark } from './Wordmark'
import { CameraTile } from './CameraTile'
import { ActivityItem } from './ActivityItem'
import { AlertBanner } from './AlertBanner'
import { CameraModal } from './CameraModal'
import { ClipModal } from './ClipModal'
import { BioOverlay } from './BioOverlay'

interface Props {
  state: TerminalState
  now: Date
  showBioOverlay: boolean
  onReaderTap: () => void
  onEndShift: () => void
  onAckAlert: () => void
  onCancelBio: () => void
}

/** Reflowed single-column phone layout (desktop keeps the kiosk shell). */
export function MobileShell(props: Props) {
  return (
    <MobileContext.Provider value={true}>
      <div
        style={{
          position: 'fixed',
          inset: 0,
          overflowY: 'auto',
          overflowX: 'hidden',
          WebkitOverflowScrolling: 'touch',
          background: color.screen,
          color: color.textPrimary,
          fontSize: 14,
          // Respect notches in landscape (left/right); top/bottom handled by
          // the header/footer so their backgrounds extend under the insets.
          paddingLeft: 'env(safe-area-inset-left)',
          paddingRight: 'env(safe-area-inset-right)',
        }}
      >
        {props.state.screen === 'lock' ? (
          <MobileLock {...props} />
        ) : (
          <MobileDashboard {...props} />
        )}
      </div>
    </MobileContext.Provider>
  )
}

/* ------------------------------- Lock ---------------------------------- */

function MobileLock({ state, now, onReaderTap }: Props) {
  const scanning = state.bioStep === 'scanning'
  const bio = lockBioVisuals(state.bioStep)
  const rv = readerVisuals(state.bioStep, state.bioMode)
  const tappable = state.bioStep === 'idle' && !!state.bioMode

  return (
    <div
      style={{
        minHeight: '100%',
        display: 'flex',
        flexDirection: 'column',
        background:
          'radial-gradient(700px 500px at 60% 20%,#0e1620 0%,#080b0d 75%)',
        padding:
          'calc(22px + env(safe-area-inset-top)) 20px calc(32px + env(safe-area-inset-bottom))',
        gap: 4,
      }}
    >
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        <Wordmark markSize={11} fontSize={15} letterSpacing="0.3em" gap={10} />
        <span
          className="mono"
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 6,
            color: color.textMuted2,
            fontSize: 10,
          }}
        >
          <span
            style={{
              width: 6,
              height: 6,
              borderRadius: '50%',
              background: color.green,
              animation: 'blink 2s infinite',
            }}
          />
          NOMINAL
        </span>
      </div>

      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: 8, marginTop: 20 }}>
        <div
          className="mono"
          style={{ color: color.green, fontSize: 11, letterSpacing: '0.22em' }}
        >
          {dateLabel(now)}
        </div>
        <div
          className="mono"
          style={{ fontSize: 56, fontWeight: 500, lineHeight: 1, letterSpacing: '-0.02em' }}
        >
          {hms(now)}
        </div>
        <div style={{ fontSize: 18, fontWeight: 600, marginTop: 14 }}>
          {SITE.name}
        </div>
        <div style={{ color: color.textMuted2, fontSize: 12 }}>
          {SITE.addr} · 8 cameras connected
        </div>

        {/* tappable biometric reader */}
        <div
          style={{
            marginTop: 30,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: 16,
          }}
        >
          <button
            onClick={tappable ? onReaderTap : undefined}
            aria-label="Fingerprint reader"
            style={{
              width: 150,
              height: 150,
              borderRadius: '50%',
              position: 'relative',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              background: '#0b1114',
              border: '1px solid rgba(255,255,255,.08)',
              cursor: tappable ? 'pointer' : 'default',
              padding: 0,
              ...rv.outer,
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
                width: 106,
                height: 106,
                borderRadius: '50%',
                border: '2px solid',
                ...bio.ringStyle,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <span
                className="mono"
                style={{ fontSize: 12, letterSpacing: '0.12em', color: '#9aa7ad' }}
              >
                {bio.centerText}
              </span>
            </div>
          </button>
          <div
            className="mono"
            style={{ fontSize: 12, color: color.textMuted2, textAlign: 'center', minHeight: 20 }}
          >
            {rv.label}
          </div>
        </div>
      </div>

      <div
        className="mono"
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          color: color.textFaint2,
          fontSize: 9,
          borderTop: '1px solid rgba(255,255,255,.05)',
          paddingTop: 14,
        }}
      >
        <span>OVERSYTE ID READER</span>
        <span>PHASE 1</span>
      </div>
    </div>
  )
}

/* ----------------------------- Dashboard ------------------------------- */

function MobileDashboard({
  state,
  now,
  showBioOverlay,
  onReaderTap,
  onEndShift,
  onAckAlert,
  onCancelBio,
}: Props) {
  const showBanner = !!state.alert && !state.alertAck
  const activeAlerts = activeAlertCount(state)
  const narrow = useViewport().w < 560

  const [openCamera, setOpenCamera] = useState<{ cam: (typeof CAMERA_DEFS)[number]; flagged: boolean } | null>(null)
  const [openClip, setOpenClip] = useState<ClipData | null>(null)
  const [clipIsLiveAlert, setClipIsLiveAlert] = useState(false)

  const metrics = [
    { label: 'CAMERAS ONLINE', value: '8/8', sub: 'Recording · 24/7', vColor: color.green, wrap: 'rgba(63,216,138,.2)' },
    { label: 'LOSS PREVENTED', value: '$186', sub: 'Est. shrinkage avoided' },
    { label: 'ACTIVE ALERTS', value: String(activeAlerts), sub: activeAlerts ? 'Needs acknowledgement' : 'All clear', vColor: activeAlerts ? color.red : color.green, wrap: activeAlerts ? 'rgba(255,81,69,.3)' : undefined },
    { label: 'SYSTEM STATUS', value: 'Nominal', sub: 'Detection nominal', vColor: color.green, small: true },
  ]

  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100%' }}>
      {/* header */}
      <div
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: 10,
          padding: 'calc(14px + env(safe-area-inset-top)) 16px 14px',
          borderBottom: '1px solid rgba(255,255,255,.06)',
          background: color.panelHeader,
          position: 'sticky',
          top: 0,
          zIndex: 10,
        }}
      >
        <div>
          <Wordmark markSize={10} fontSize={14} letterSpacing="0.26em" gap={9} />
          <div className="mono" style={{ fontSize: 10, color: color.textMuted2, marginTop: 4 }}>
            {SITE.name} · {SITE.addr}
          </div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{ textAlign: 'right' }}>
            <div className="mono" style={{ fontSize: 15, fontWeight: 500 }}>{hms(now)}</div>
            <div className="mono" style={{ fontSize: 8, color: color.green }}>
              ON SHIFT · {state.user?.clockIn ?? ''}
            </div>
          </div>
          <div
            style={{
              width: 30, height: 30, borderRadius: 8,
              background: 'rgba(63,216,138,.14)', color: color.green,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontWeight: 600, fontSize: 12,
            }}
          >
            {state.user?.initials ?? ''}
          </div>
          <button
            className="btn btn-endshift"
            onClick={onEndShift}
            style={{
              cursor: 'pointer', background: 'rgba(255,255,255,.04)',
              border: '1px solid rgba(255,255,255,.1)', color: color.textSecondary2,
              fontFamily: 'inherit', fontSize: 11, fontWeight: 500,
              padding: '7px 11px', borderRadius: 8,
            }}
          >
            End shift
          </button>
        </div>
      </div>

      {showBanner && state.alert && (
        <AlertBanner
          alert={state.alert}
          stack={narrow}
          onAck={onAckAlert}
          onViewClip={() => {
            const a = state.alert!
            setOpenClip({ cam: a.cam, loc: a.loc, type: a.type, conf: a.conf, time: a.time })
            setClipIsLiveAlert(true)
          }}
        />
      )}

      {/* cameras */}
      <div style={{ padding: '16px 16px 4px' }}>
        <SectionHead title="Live Camera Intelligence" pill="8/8 ONLINE" />
      </div>
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(2, 1fr)',
          gap: 10,
          padding: '0 16px',
        }}
      >
        {CAMERA_DEFS.map((cam, i) => {
          const flagged = showBanner && i === FLAGGED_CAMERA_INDEX
          return (
            <CameraTile
              key={cam.label}
              cam={cam}
              flagged={flagged}
              index={i}
              onOpen={() => setOpenCamera({ cam, flagged })}
            />
          )
        })}
      </div>

      {/* metrics */}
      <div style={{ padding: '18px 16px 4px' }}>
        <SectionHead title="Store Status" />
      </div>
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(2, 1fr)',
          gap: 9,
          padding: '0 16px',
        }}
      >
        {metrics.map((m) => (
          <div
            key={m.label}
            style={{
              border: `1px solid ${m.wrap ?? 'rgba(255,255,255,.07)'}`,
              borderRadius: 11,
              padding: '12px 13px',
              background: 'rgba(255,255,255,.02)',
            }}
          >
            <div className="mono" style={{ fontSize: 9, letterSpacing: '0.1em', color: color.textMuted2 }}>{m.label}</div>
            <div className="mono" style={{ fontSize: m.small ? 19 : 23, fontWeight: 600, marginTop: 5, color: m.vColor }}>{m.value}</div>
            <div style={{ fontSize: 10, color: color.textMuted2, marginTop: 1 }}>{m.sub}</div>
          </div>
        ))}
      </div>

      {/* shift verification */}
      <div style={{ padding: '16px 16px 0' }}>
        <div
          style={{
            border: '1px solid rgba(63,216,138,.22)',
            borderRadius: 12,
            padding: 13,
            background: 'rgba(63,216,138,.05)',
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span className="mono" style={{ fontSize: 10, letterSpacing: '0.1em', color: color.green }}>SHIFT VERIFICATION</span>
            <span className="mono" style={{ fontSize: 9, color: color.green, display: 'flex', alignItems: 'center', gap: 4 }}>
              <span style={{ width: 6, height: 6, borderRadius: '50%', background: color.green }} />MATCHED
            </span>
          </div>
          <div style={{ marginTop: 9, fontSize: 13, fontWeight: 600 }}>
            {state.user?.name ?? ''} · {state.user?.role ?? ''}
          </div>
          <div className="mono" style={{ fontSize: 10, color: '#9aa7ad', marginTop: 3, lineHeight: 1.5 }}>
            Biometric clock-in {state.user?.clockIn ?? ''} auto-confirmed against camera-observed presence at register.
          </div>
        </div>
      </div>

      {/* activity */}
      <div style={{ padding: '18px 16px 6px' }}>
        <SectionHead title="Live Activity" note="PAST 4 HOURS" />
      </div>
      <div style={{ padding: '0 16px' }}>
        {state.events.map((e, i) => (
          <ActivityItem
            key={`${e.time}-${e.title}-${i}`}
            event={e}
            onViewClip={(clip) => {
              setOpenClip(clip)
              setClipIsLiveAlert(false)
            }}
          />
        ))}
      </div>

      {/* footer */}
      <div
        className="mono"
        style={{
          marginTop: 'auto',
          display: 'flex',
          flexWrap: 'wrap',
          gap: 12,
          padding: '12px 16px calc(12px + env(safe-area-inset-bottom))',
          borderTop: '1px solid rgba(255,255,255,.06)',
          background: color.footer,
          fontSize: 9,
          color: color.textFaint,
          letterSpacing: '0.06em',
        }}
      >
        <span style={{ color: color.green }}>● DETECTION ACTIVE</span>
        <span style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
          <span style={{ width: 6, height: 6, borderRadius: '50%', background: color.red, animation: 'blink 1.2s infinite' }} />
          REC 8/8 · {RECORDING.duty}
        </span>
        <span>OVERSYTE PHASE 1 · v1.0</span>
      </div>

      {openClip && (
        <ClipModal
          clip={openClip}
          onClose={() => setOpenClip(null)}
          onAck={clipIsLiveAlert && showBanner ? onAckAlert : undefined}
        />
      )}
      {openCamera && (
        <CameraModal
          cam={openCamera.cam}
          flagged={openCamera.flagged}
          onClose={() => setOpenCamera(null)}
        />
      )}
      {showBioOverlay && (
        <BioOverlay
          mode={state.bioMode}
          step={state.bioStep}
          onCancel={onCancelBio}
          onScan={onReaderTap}
        />
      )}
    </div>
  )
}

function SectionHead({ title, pill, note }: { title: string; pill?: string; note?: string }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
        <span style={{ fontWeight: 600, fontSize: 14 }}>{title}</span>
        {pill && (
          <span
            className="mono"
            style={{
              fontSize: 10, color: color.green, padding: '2px 7px',
              border: '1px solid rgba(63,216,138,.3)', borderRadius: 20,
              background: 'rgba(63,216,138,.08)',
            }}
          >
            {pill}
          </span>
        )}
      </div>
      {note && <span className="mono" style={{ fontSize: 10, color: color.textMuted2 }}>{note}</span>}
    </div>
  )
}
