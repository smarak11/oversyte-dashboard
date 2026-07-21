import { useEffect, useRef, useState } from 'react'
import { feedImageUrl, feedVideoSources } from '../data'
import { CCTV_FILTER, color } from '../theme'
import type { CameraDef } from '../types'

/** Guess a <source> MIME type from a file extension. */
function mimeFor(url: string): string | undefined {
  const ext = url.split('?')[0].split('.').pop()?.toLowerCase()
  if (ext === 'webm') return 'video/webm'
  if (ext === 'mp4') return 'video/mp4'
  if (ext === 'ogv' || ext === 'ogg') return 'video/ogg'
  return undefined // e.g. .m3u8 (HLS) — attach via a player in production
}

interface Props {
  cam: CameraDef
  /** Grid position — desyncs the still-fallback drift so tiles don't move in lockstep. */
  index?: number
  /** Animate the still fallback with the live-motion drift (default true). */
  drift?: boolean
}

/**
 * The visual feed layer for a camera. Plays a looping muted `<video>` when a
 * moving-feed URL is available, using the still image as the poster and as the
 * fallback if the video is missing or fails to load. This is the single place
 * to swap in real streams (attach HLS via hls.js or a WebRTC track to the
 * `<video>` element here).
 */
export function CameraFeed({ cam, index = 0, drift = true }: Props) {
  const still = feedImageUrl(cam.pex)
  const sources = feedVideoSources(cam)
  const [failed, setFailed] = useState(false)
  const ref = useRef<HTMLVideoElement>(null)

  // Guarantee muted (some browsers gate autoplay on the property, not the attr)
  // and kick off playback. Muted autoplay works by default in Chrome/Edge; if a
  // stricter policy blocks it, start on the first user interaction instead.
  useEffect(() => {
    const el = ref.current
    if (!el || !sources.length || failed) return
    el.muted = true
    const tryPlay = () => el.play().catch(() => {})
    tryPlay()

    const onGesture = () => tryPlay()
    const opts: AddEventListenerOptions = { once: true, passive: true }
    window.addEventListener('pointerdown', onGesture, opts)
    window.addEventListener('keydown', onGesture, opts)
    window.addEventListener('touchstart', onGesture, opts)
    return () => {
      window.removeEventListener('pointerdown', onGesture)
      window.removeEventListener('keydown', onGesture)
      window.removeEventListener('touchstart', onGesture)
    }
    // sources is stable per camera; re-run only when playback eligibility changes
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cam.label, failed])

  if (sources.length && !failed) {
    return (
      <video
        ref={ref}
        poster={still}
        autoPlay
        muted
        loop
        playsInline
        preload="auto"
        aria-hidden
        tabIndex={-1}
        onError={() => setFailed(true)}
        style={{
          position: 'absolute',
          inset: 0,
          width: '100%',
          height: '100%',
          objectFit: 'cover',
          background: color.tile,
          filter: CCTV_FILTER,
        }}
      >
        {sources.map((url) => (
          <source key={url} src={url} type={mimeFor(url)} />
        ))}
      </video>
    )
  }

  // Still fallback (no video configured, or it failed to load).
  return (
    <div
      style={{
        position: 'absolute',
        inset: 0,
        filter: CCTV_FILTER,
        background: color.tile,
        backgroundImage: `url(${still})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        animation: drift ? 'feedlive 22s ease-in-out infinite' : undefined,
        animationDelay: drift ? `${-index * 2.6}s` : undefined,
      }}
    />
  )
}
