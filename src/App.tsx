import { useCallback, useEffect, useReducer, useRef } from 'react'
import {
  DEMO_ALERT_DELAY_MS,
  SCAN_FINISH_MS,
  SCAN_MATCH_MS,
} from './data'
import { hm } from './time'
import { initialState, terminalReducer } from './terminalReducer'
import type { BioMode } from './types'
import { useNow } from './useNow'
import { LockScreen } from './components/LockScreen'
import { Dashboard } from './components/Dashboard'
import { ReaderModule } from './components/ReaderModule'
import { color } from './theme'

export function App() {
  const [state, dispatch] = useReducer(terminalReducer, initialState)
  const now = useNow()

  // Mirror state so imperative timer callbacks read fresh values without
  // being re-created on every render.
  const stateRef = useRef(state)
  stateRef.current = state

  // Track pending timeouts so we can clear them on unmount.
  const timers = useRef<ReturnType<typeof setTimeout>[]>([])
  const after = useCallback((fn: () => void, ms: number) => {
    const id = setTimeout(fn, ms)
    timers.current.push(id)
    return id
  }, [])
  useEffect(() => {
    const pending = timers.current
    return () => pending.forEach(clearTimeout)
  }, [])

  /** Arm the reader for what the next tap should do. */
  const arm = useCallback((mode: BioMode) => dispatch({ type: 'ARM', mode }), [])

  /** Simulated fingerprint scan. In production, drive this from the reader SDK. */
  const readerTap = useCallback(() => {
    const s = stateRef.current
    if (s.bioStep !== 'idle' || !s.bioMode) return
    const mode = s.bioMode
    dispatch({ type: 'SCAN_START' })
    after(() => dispatch({ type: 'SCAN_MATCHED' }), SCAN_MATCH_MS)
    after(() => {
      dispatch({ type: 'FINISH', mode, time: hm(new Date()) })
      // Demo: shortly after clock-in, raise the theft alert.
      if (mode === 'unlock') {
        after(
          () => dispatch({ type: 'RAISE_ALERT', time: hm(new Date()) }),
          DEMO_ALERT_DELAY_MS,
        )
      }
    }, SCAN_FINISH_MS)
  }, [after])

  const endShift = useCallback(() => arm('clockout'), [arm])
  const ackAlert = useCallback(() => arm('ack'), [arm])
  const cancelBio = useCallback(() => dispatch({ type: 'CANCEL_BIO' }), [])

  const showBioOverlay =
    state.screen === 'dashboard' &&
    (state.bioMode === 'clockout' || state.bioMode === 'ack')

  return (
    <div
      style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 40,
        background:
          'radial-gradient(1200px 700px at 50% -10%,#0d1418 0%,#05080a 70%)',
      }}
    >
      {/* ===== TABLET ===== */}
      <div
        style={{
          position: 'relative',
          width: 1200,
          height: 824,
          background: color.tabletBody,
          borderRadius: 26,
          padding: 16,
          boxShadow:
            '0 40px 120px rgba(0,0,0,.7),0 0 0 2px #141c21,inset 0 0 0 1px rgba(255,255,255,.03)',
        }}
      >
        {/* volume rocker detail */}
        <div
          style={{
            position: 'absolute',
            top: '50%',
            left: 9,
            width: 5,
            height: 60,
            background: '#1a2429',
            borderRadius: 4,
            transform: 'translateY(-40px)',
          }}
        />
        <div
          style={{
            position: 'absolute',
            top: '50%',
            left: 9,
            width: 5,
            height: 38,
            background: '#1a2429',
            borderRadius: 4,
            transform: 'translateY(30px)',
          }}
        />

        <div
          style={{
            position: 'relative',
            width: '100%',
            height: '100%',
            borderRadius: 14,
            overflow: 'hidden',
            background: color.screen,
            color: color.textPrimary,
            fontSize: 14,
          }}
        >
          {state.screen === 'lock' ? (
            <LockScreen state={state} now={now} />
          ) : (
            <Dashboard
              state={state}
              now={now}
              showBioOverlay={showBioOverlay}
              onEndShift={endShift}
              onAckAlert={ackAlert}
              onCancelBio={cancelBio}
            />
          )}
        </div>
      </div>

      {/* ===== DOCKED BIOMETRIC READER MODULE ===== */}
      <ReaderModule
        bioStep={state.bioStep}
        bioMode={state.bioMode}
        onTap={readerTap}
      />
    </div>
  )
}
