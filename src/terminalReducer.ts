import { INITIAL_EVENTS } from './data'
import type { Alert, BioMode, BioStep, Screen, User } from './types'

export interface TerminalState {
  screen: Screen
  bioMode: BioMode
  bioStep: BioStep
  user: User | null
  alert: Alert | null
  alertAck: boolean
  events: import('./types').ActivityEvent[]
}

export const initialState: TerminalState = {
  screen: 'lock',
  bioMode: 'unlock',
  bioStep: 'idle',
  user: null,
  alert: null,
  alertAck: false,
  events: INITIAL_EVENTS,
}

export type TerminalAction =
  | { type: 'ARM'; mode: BioMode }
  | { type: 'SCAN_START' }
  | { type: 'SCAN_MATCHED' }
  | { type: 'CANCEL_BIO' }
  /** Complete a scan. `time` is HH:MM captured when the scan finished. */
  | { type: 'FINISH'; mode: Exclude<BioMode, null>; time: string }
  | { type: 'RAISE_ALERT'; time: string }

export function terminalReducer(
  state: TerminalState,
  action: TerminalAction,
): TerminalState {
  switch (action.type) {
    case 'ARM':
      return { ...state, bioMode: action.mode, bioStep: 'idle' }

    case 'SCAN_START':
      return { ...state, bioStep: 'scanning' }

    case 'SCAN_MATCHED':
      return { ...state, bioStep: 'matched' }

    case 'CANCEL_BIO':
      return { ...state, bioMode: null, bioStep: 'idle' }

    case 'FINISH':
      return finish(state, action.mode, action.time)

    case 'RAISE_ALERT':
      return {
        ...state,
        alert: {
          time: action.time,
          loc: 'Aisle 2',
          cam: 'CAM 03',
          type: 'Possible theft — concealment',
          conf: 94,
        },
        alertAck: false,
      }

    default:
      return state
  }
}

function finish(
  state: TerminalState,
  mode: Exclude<BioMode, null>,
  time: string,
): TerminalState {
  switch (mode) {
    case 'unlock': {
      const user: User = {
        name: 'Marcus Tran',
        role: 'Evening Associate',
        initials: 'MT',
        clockIn: time,
      }
      return {
        ...state,
        screen: 'dashboard',
        user,
        bioStep: 'idle',
        bioMode: null,
        events: [
          {
            time,
            title: 'Shift check-in verified',
            desc: 'Biometric ID matched camera-observed presence at register. Payroll record auto-confirmed.',
            sev: 'ok',
          },
          ...state.events,
        ],
      }
    }

    case 'clockout':
      return {
        ...state,
        screen: 'lock',
        bioMode: 'unlock',
        bioStep: 'idle',
        user: null,
        alert: null,
        alertAck: false,
        events: [
          {
            time,
            title: 'Shift ended — clock-out verified',
            desc: 'Biometric clock-out recorded. Camera confirmed associate left the counter area.',
            sev: 'ok',
          },
          ...state.events,
        ],
      }

    case 'ack':
      return {
        ...state,
        alertAck: true,
        bioStep: 'idle',
        bioMode: null,
        events: [
          {
            time,
            title: `Alert acknowledged — ${state.alert?.loc ?? ''}`,
            desc: `${state.user?.name ?? 'Manager'} confirmed the concealment alert on the reader. Clip preserved as evidence.`,
            sev: 'crit',
            conf: state.alert?.conf,
            clip: true,
            cam: state.alert?.cam,
            loc: state.alert?.loc,
          },
          ...state.events,
        ],
      }
  }
}

/** Number of unacknowledged alerts (0 or 1 in Phase 1). */
export const activeAlertCount = (s: TerminalState): number =>
  s.alert && !s.alertAck ? 1 : 0
