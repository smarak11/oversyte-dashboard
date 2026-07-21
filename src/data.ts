import type { ActivityEvent, CameraDef } from './types'

/**
 * Master switch for the moving-video feed layer.
 *
 * When `true`, each camera plays its `video` URL (a looping MP4) with the
 * `pex` still as the poster/fallback. When `false`, tiles show the still with
 * a subtle live-motion drift. The seeded `video` URLs below are **short sample
 * loops** purely to demonstrate the pipeline — swap them for each camera's real
 * stream (a direct MP4/HLS URL, or an HLS/WebRTC source you attach in
 * `CameraFeed`) for production.
 */
export const VIDEO_FEEDS_ENABLED = true

// Gas-station / convenience-store sample feeds (free Pexels stock, no
// attribution required). H.264 MP4 — plays in Chrome/Edge/Safari/Firefox.
// Real deployments replace each with the camera's own stream (MP4/HLS/WebRTC).
const PEX_VID = (path: string) => `https://videos.pexels.com/video-files/${path}.mp4`

/**
 * The 8 site cameras, in grid order.
 * CAM 03 (AISLE 2, index 2) is the one flagged by the demo theft alert.
 *
 * `pex` is a placeholder still (poster/fallback); `video` is a placeholder
 * moving feed matched to the camera's location. In production, point `video`
 * at each camera's real stream and keep the still only as the poster.
 */
export const CAMERA_DEFS: CameraDef[] = [
  { label: 'CAM 01', loc: 'STOREFRONT', pex: '36981899', video: PEX_VID('12118343/12118343-sd_640_360_25fps') },
  { label: 'CAM 02', loc: 'REGISTER', pex: '8867645', video: PEX_VID('5137847/5137847-sd_640_360_30fps') },
  { label: 'CAM 03', loc: 'AISLE 2', pex: '21582444', video: PEX_VID('7457422/7457422-sd_640_360_30fps') },
  { label: 'CAM 04', loc: 'FUEL PUMPS', pex: '19571375', video: PEX_VID('14603999/14603999-sd_640_360_24fps') },
  { label: 'CAM 05', loc: 'COOLERS', pex: '18925020', video: PEX_VID('5103988/5103988-sd_640_360_30fps') },
  { label: 'CAM 06', loc: 'STOCKROOM', pex: '34357798', video: PEX_VID('6641527/6641527-sd_640_360_30fps') },
  { label: 'CAM 07', loc: 'ENTRANCE', pex: '30750082', video: PEX_VID('14627006/14627006-sd_640_360_24fps') },
  { label: 'CAM 08', loc: 'PARKING LOT', pex: '10556938', video: PEX_VID('4092535/4092535-sd_640_360_25fps') },
]

/** Index of the camera the demo theft alert flags (CAM 03 / AISLE 2). */
export const FLAGGED_CAMERA_INDEX = 2

/** Ordered moving-feed sources for a camera, or [] when video feeds are off. */
export function feedVideoSources(cam: CameraDef): string[] {
  if (!VIDEO_FEEDS_ENABLED || !cam.video) return []
  return Array.isArray(cam.video) ? cam.video : [cam.video]
}

/**
 * All feeds record continuously (24/7). This is represented in the UI; the
 * actual capture/retention runs on the on-site NVR + storage backend.
 */
export const RECORDING = {
  /** Every camera records around the clock. */
  continuous: true,
  /** Human-readable duty cycle shown in the UI. */
  duty: '24/7',
  /** How long recorded footage is retained. */
  retention: '30-DAY RETENTION',
  /** Rolling edge buffer kept in memory for instant clip export. */
  edgeBuffer: '12s ROLLING',
} as const

/** Build a placeholder feed image URL for a camera. */
export function feedImageUrl(pex: string): string {
  return `https://images.pexels.com/photos/${pex}/pexels-photo-${pex}.jpeg?auto=compress&cs=tinysrgb&w=640&h=420&fit=crop`
}

/** Seed activity, newest first. */
export const INITIAL_EVENTS: ActivityEvent[] = [
  {
    time: '18:41',
    title: 'Shift check-in verified',
    desc: 'Day associate clock-out matched camera-observed departure. Payroll auto-confirmed.',
    sev: 'ok',
  },
  {
    time: '18:14',
    title: 'Possible theft — Aisle 2',
    desc: 'Concealment detected. Alert sent to on-duty manager and acknowledged.',
    sev: 'crit',
    conf: 94,
    clip: true,
    cam: 'CAM 03',
    loc: 'Aisle 2',
  },
  {
    time: '17:52',
    title: 'Loitering flagged — Aisle 5',
    desc: 'Repeated aisle passes without purchase. Logged for review, no action taken.',
    sev: 'warn',
    conf: 78,
  },
  {
    time: '16:20',
    title: 'Camera 06 reconnected',
    desc: 'Stockroom feed restored after brief drop. Coverage back to 8/8.',
    sev: 'info',
  },
]

/** Delay (ms) after clock-in before the demo theft alert auto-raises. */
export const DEMO_ALERT_DELAY_MS = 5500
/** Reader tap → "matched" delay. */
export const SCAN_MATCH_MS = 1700
/** Reader tap → finish delay. */
export const SCAN_FINISH_MS = 3200
