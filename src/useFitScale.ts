import { useEffect, useState } from 'react'

function computeScale(
  designW: number,
  designH: number,
  pad: number,
  maxScale: number,
): number {
  if (typeof window === 'undefined') return 1
  const vw = window.innerWidth
  const vh = window.innerHeight
  const s = Math.min((vw - pad) / designW, (vh - pad) / designH)
  return Math.max(0.1, Math.min(s, maxScale))
}

/**
 * Uniform scale factor that fits a fixed `designW × designH` canvas into the
 * current viewport (letterbox / "contain" fit), so the pixel-perfect kiosk
 * design looks correct and complete on any screen — laptop, tablet, or phone,
 * in any orientation. Recomputes on resize and orientation change.
 */
export function useFitScale(
  designW: number,
  designH: number,
  pad = 20,
  maxScale = 1.5,
): number {
  const [scale, setScale] = useState(() =>
    computeScale(designW, designH, pad, maxScale),
  )

  useEffect(() => {
    const onResize = () => setScale(computeScale(designW, designH, pad, maxScale))
    onResize()
    window.addEventListener('resize', onResize)
    window.addEventListener('orientationchange', onResize)
    return () => {
      window.removeEventListener('resize', onResize)
      window.removeEventListener('orientationchange', onResize)
    }
  }, [designW, designH, pad, maxScale])

  return scale
}
