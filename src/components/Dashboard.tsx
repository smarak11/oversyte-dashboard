import { useState } from 'react'
import type { TerminalState } from '../terminalReducer'
import { activeAlertCount } from '../terminalReducer'
import { RECORDING } from '../data'
import { color } from '../theme'
import type { CameraDef, ClipData } from '../types'
import { DashboardHeader } from './DashboardHeader'
import { AlertBanner } from './AlertBanner'
import { CameraGrid } from './CameraGrid'
import { RightRail } from './RightRail'
import { BioOverlay } from './BioOverlay'
import { ClipModal } from './ClipModal'
import { CameraModal } from './CameraModal'

interface Props {
  state: TerminalState
  now: Date
  showBioOverlay: boolean
  onEndShift: () => void
  onAckAlert: () => void
  onCancelBio: () => void
}

export function Dashboard({
  state,
  now,
  showBioOverlay,
  onEndShift,
  onAckAlert,
  onCancelBio,
}: Props) {
  const showBanner = !!state.alert && !state.alertAck
  const activeAlerts = activeAlertCount(state)

  // The clip currently open in the viewer, or null. Holds a snapshot so it
  // stays valid even after the underlying alert/event changes.
  const [openClip, setOpenClip] = useState<ClipData | null>(null)
  // Whether the open clip is the live, still-unacknowledged alert.
  const [clipIsLiveAlert, setClipIsLiveAlert] = useState(false)

  // The camera currently popped out for a detailed view, or null.
  const [openCamera, setOpenCamera] = useState<{
    cam: CameraDef
    flagged: boolean
  } | null>(null)

  return (
    <div
      style={{
        position: 'absolute',
        inset: 0,
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      <DashboardHeader
        user={state.user}
        now={now}
        onEndShift={onEndShift}
      />

      {showBanner && state.alert && (
        <AlertBanner
          alert={state.alert}
          onAck={onAckAlert}
          onViewClip={() => {
            const a = state.alert!
            setOpenClip({
              cam: a.cam,
              loc: a.loc,
              type: a.type,
              conf: a.conf,
              time: a.time,
            })
            setClipIsLiveAlert(true)
          }}
        />
      )}

      {/* body */}
      <div style={{ flex: 1, display: 'flex', minHeight: 0 }}>
        <CameraGrid
          flagActive={showBanner}
          onOpenCamera={(cam, flagged) => setOpenCamera({ cam, flagged })}
        />
        <RightRail
          user={state.user}
          events={state.events}
          activeAlerts={activeAlerts}
          onViewClip={(clip) => {
            setOpenClip(clip)
            setClipIsLiveAlert(false)
          }}
        />
      </div>

      {/* footer status strip */}
      <div
        className="mono"
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '9px 22px',
          borderTop: '1px solid rgba(255,255,255,.06)',
          background: color.footer,
          fontSize: 10,
          color: color.textFaint,
          letterSpacing: '0.06em',
        }}
      >
        <span style={{ display: 'flex', gap: 18 }}>
          <span style={{ color: color.green }}>● DETECTION ACTIVE</span>
          <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <span
              style={{
                width: 6,
                height: 6,
                borderRadius: '50%',
                background: color.red,
                boxShadow: `0 0 6px ${color.red}`,
                animation: 'blink 1.2s infinite',
              }}
            />
            REC 8/8 · {RECORDING.duty}
          </span>
          <span>EDGE BUFFER · {RECORDING.edgeBuffer}</span>
          <span>ALERT LATENCY · 4.2s</span>
        </span>
        <span>OVERSYTE PHASE 1 · v1.0 · NORTH AMERICA</span>
      </div>

      {openClip && (
        <ClipModal
          clip={openClip}
          onClose={() => setOpenClip(null)}
          // Only the live, unacknowledged alert can be acknowledged from here.
          // (ClipModal calls onClose before onAck, so no need to clear here.)
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
        />
      )}
    </div>
  )
}
