export type Screen = 'lock' | 'dashboard'

/** What tapping the reader will do. `null` = disarmed. */
export type BioMode = 'unlock' | 'clockout' | 'ack' | null

/** Scan animation phase of the biometric reader. */
export type BioStep = 'idle' | 'scanning' | 'matched'

export type Severity = 'ok' | 'crit' | 'warn' | 'info'

export interface User {
  name: string
  role: string
  initials: string
  /** HH:MM clock-in time. */
  clockIn: string
}

export interface Alert {
  /** HH:MM. */
  time: string
  loc: string
  cam: string
  type: string
  /** AI confidence, 0–100. */
  conf: number
}

export interface ActivityEvent {
  /** HH:MM. */
  time: string
  title: string
  desc: string
  sev: Severity
  /** AI confidence tag, if any. */
  conf?: number
  /** Whether a video clip is attached. */
  clip?: boolean
  /** Camera label the clip belongs to, e.g. "CAM 03" (defaults to the flagged cam). */
  cam?: string
  /** Location the clip belongs to, e.g. "Aisle 2". */
  loc?: string
}

/** Everything the clip viewer needs to play a recorded detection. */
export interface ClipData {
  cam: string
  loc: string
  /** Short description / detection type shown as the clip heading. */
  type: string
  conf?: number
  /** HH:MM the clip was captured. */
  time: string
}

/** Static camera definition (label, location, placeholder feed image). */
export interface CameraDef {
  label: string
  loc: string
  /** Pexels photo id — placeholder still / poster; replace with a real feed. */
  pex: string
  /**
   * Moving-feed source(s) — a URL or an ordered list of URLs (the browser
   * plays the first it supports). Placeholder now; real stream in prod.
   */
  video?: string | string[]
}
