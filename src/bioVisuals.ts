import type { CSSProperties } from 'react'
import { color } from './theme'
import type { BioMode, BioStep } from './types'

export interface ReaderVisuals {
  outer: CSSProperties
  ring: CSSProperties
  inner: CSSProperties
  led: CSSProperties
  ledLabel: string
  label: string
}

/** Visuals for the docked reader module (right edge). */
export function readerVisuals(step: BioStep, mode: BioMode): ReaderVisuals {
  if (step === 'scanning') {
    return {
      outer: { boxShadow: 'inset 0 0 30px rgba(63,216,138,.25)' },
      ring: { borderColor: color.green },
      inner: { borderColor: 'rgba(63,216,138,.5)' },
      led: { background: color.amber, boxShadow: `0 0 10px ${color.amber}` },
      ledLabel: 'SCANNING',
      label: 'Reading fingerprint…',
    }
  }
  if (step === 'matched') {
    return {
      outer: {
        background:
          'radial-gradient(circle,rgba(63,216,138,.35),rgba(63,216,138,.06))',
        boxShadow:
          'inset 0 0 34px rgba(63,216,138,.4),0 0 30px rgba(63,216,138,.35)',
      },
      ring: { borderColor: color.green, background: 'rgba(63,216,138,.25)' },
      inner: { borderColor: color.green, background: 'rgba(63,216,138,.4)' },
      led: { background: color.green, boxShadow: `0 0 14px ${color.green}` },
      ledLabel: 'VERIFIED',
      label: 'Identity verified ✓',
    }
  }

  // idle — depends on what the reader is armed to do
  const base: ReaderVisuals = {
    outer: { boxShadow: 'inset 0 0 24px rgba(63,216,138,.10)' },
    ring: { borderColor: 'rgba(63,216,138,.35)' },
    inner: { borderColor: 'rgba(63,216,138,.25)' },
    led: {
      background: color.green,
      boxShadow: `0 0 8px ${color.green}`,
      animation: 'blink 2s infinite',
    },
    ledLabel: 'READY',
    label: 'Tap to scan',
  }

  if (mode === 'clockout') {
    return { ...base, label: 'Tap to end shift', ledLabel: 'ARMED' }
  }
  if (mode === 'ack') {
    return {
      ...base,
      label: 'Tap to acknowledge',
      ledLabel: 'ARMED',
      led: {
        background: color.red,
        boxShadow: `0 0 10px ${color.red}`,
        animation: 'blink 1.2s infinite',
      },
    }
  }
  if (mode === 'unlock') {
    return { ...base, label: 'Tap to start shift' }
  }
  return base
}

export interface LockBioVisuals {
  centerText: string
  ringStyle: CSSProperties
  statusText: string
  promptTitle: string
  promptSub: string
}

/** Visuals for the lock-screen biometric ring + prompt copy. */
export function lockBioVisuals(step: BioStep): LockBioVisuals {
  if (step === 'scanning') {
    return {
      centerText: 'SCAN',
      ringStyle: { borderColor: color.green },
      statusText: 'Matching biometric identity…',
      promptTitle: 'Place finger on the reader →',
      promptSub: 'Clock in and unlock this terminal',
    }
  }
  if (step === 'matched') {
    return {
      centerText: 'VERIFIED',
      ringStyle: { borderColor: color.green, background: 'rgba(63,216,138,.2)' },
      statusText: 'Marcus Tran · Evening Associate\nClock-in confirmed by camera',
      promptTitle: 'Identity verified',
      promptSub: 'Unlocking terminal…',
    }
  }
  return {
    centerText: 'READY',
    ringStyle: { borderColor: 'rgba(63,216,138,.4)' },
    statusText: 'Awaiting fingerprint',
    promptTitle: 'Place finger on the reader →',
    promptSub: 'Clock in and unlock this terminal',
  }
}

/** Shared 84–120px confirm-ring center text + border (overlay + lock). */
export function overlaySubText(step: BioStep): string {
  if (step === 'scanning') return 'Reading fingerprint…'
  if (step === 'matched') return 'Identity verified ✓'
  return 'Scan your finger on the OVERSYTE ID reader to confirm.'
}
