/**
 * Uniform scale factor that fits a fixed `designW × designH` canvas into a
 * viewport of `w × h` (letterbox / "contain" fit), so the pixel-perfect kiosk
 * design looks correct and complete on any screen — laptop, tablet, or phone,
 * in any orientation.
 *
 * Pure function: pass in the current viewport (from `useViewport`) so scale and
 * orientation always derive from the same measurement.
 */
export function fitScale(
  w: number,
  h: number,
  designW: number,
  designH: number,
  pad = 20,
  maxScale = 1.5,
): number {
  const s = Math.min((w - pad) / designW, (h - pad) / designH)
  return Math.max(0.1, Math.min(s, maxScale))
}
