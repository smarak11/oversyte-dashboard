import { useEffect, useState } from 'react'

interface Viewport {
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

/** Current viewport size + a phone-portrait flag, updated on resize/rotate. */
export function useViewport(): Viewport {
  const [vp, setVp] = useState(read)
  useEffect(() => {
    const on = () => setVp(read())
    window.addEventListener('resize', on)
    window.addEventListener('orientationchange', on)
    return () => {
      window.removeEventListener('resize', on)
      window.removeEventListener('orientationchange', on)
    }
  }, [])
  return vp
}
