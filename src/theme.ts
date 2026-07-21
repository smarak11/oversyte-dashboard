/**
 * Oversyte design tokens (from the Phase 1 design handoff).
 * Kept in one place so colors/typography stay consistent across the app.
 */

export const color = {
  // surfaces
  page: '#05080a', // outer page
  tabletBody: '#0a0f12', // bezel + reader module
  screen: '#0a0e10', // dashboard/screen bg
  panelHeader: '#0b1113',
  panelRail: '#0b1012',
  panelInfo: '#0b0f11',
  footer: '#080c0e',
  tile: '#0c1215', // camera tile base

  // brand / status
  green: '#3fd88a',
  greenHover: '#6fe6a8',
  red: '#ff5145',
  redText: '#ff8078',
  redTextLight: '#ffb0aa',
  redTextMuted: '#e6a29c',
  amber: '#f2b03d',
  infoGray: '#6b7a80',

  // text
  textPrimary: '#e6edf0',
  textSecondary: '#cfd8dc',
  textSecondary2: '#c3ccd0',
  textMuted: '#8a969c',
  textMuted2: '#7e8c93',
  textFaint: '#5c6b72',
  textFaint2: '#4b585e',
} as const

export const font = {
  display: "'Space Grotesk', system-ui, sans-serif",
  mono: "'JetBrains Mono', monospace",
} as const

/** CCTV filter applied to every camera feed image. */
export const CCTV_FILTER = 'grayscale(0.28) contrast(1.06) brightness(0.94)'

export const SITE = {
  name: 'Downtown Store #847',
  addr: 'Main & 6th',
} as const
