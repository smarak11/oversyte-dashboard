import { useEffect, useState } from 'react'

export interface Viewport {
  w: number
  h: number
  /** Small screen in portrait orientation (i.e. a phone held upright). */
  isPhonePortrait: boolean
}

function read(): Viewport {
  const w = typeof window === 'undefined' ? 1344 : window.innerWidth
  const h = typeof window === 'undefined' ? 824 : window.innerHeight
  return { w, h, isPhonePortrait: w < 680 && h > w }
}

/**
 * Current viewport size + a phone-portrait flag, updated on resize AND
 * rotation. Rotation is handled carefully: mobile browsers fire
 * `orientationchange` *before* `innerWidth/innerHeight` reflect the new
 * orientation, so we re-measure a few times after it fires (and lean on
 * `visualViewport` / `matchMedia`, which report the settled size) to avoid
 * getting stuck at the pre-rotation dimensions.
 */
export function useViewport(): Viewport {
  const [vp, setVp] = useState(read)

  useEffect(() => {
    // Synchronous update (no requestAnimationFrame — rAF is paused in hidden
    // tabs). The same-value guard keeps rapid resize events cheap.
    const update = () => {
      setVp((prev) => {
        const next = read()
        return prev.w === next.w && prev.h === next.h ? prev : next
      })
    }

    // Rotation: `innerWidth/innerHeight` lag `orientationchange`, so re-measure
    // a few times afterward (setTimeout still fires in background tabs).
    const settleAfterRotate = () => {
      ;[60, 150, 300, 500, 800].forEach((t) => setTimeout(update, t))
    }

    update()
    window.addEventListener('resize', update)
    window.addEventListener('orientationchange', settleAfterRotate)

    const vv = window.visualViewport
    vv?.addEventListener('resize', update)

    const mq = window.matchMedia('(orientation: portrait)')
    const onOrient = () => {
      update()
      settleAfterRotate()
    }
    // Safari <14 uses addListener; modern browsers use addEventListener.
    if (mq.addEventListener) mq.addEventListener('change', onOrient)
    else mq.addListener(onOrient)

    return () => {
      window.removeEventListener('resize', update)
      window.removeEventListener('orientationchange', settleAfterRotate)
      vv?.removeEventListener('resize', update)
      if (mq.removeEventListener) mq.removeEventListener('change', onOrient)
      else mq.removeListener(onOrient)
    }
  }, [])

  return vp
}
