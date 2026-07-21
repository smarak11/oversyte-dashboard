import { useEffect, useState } from 'react'
import { CAMERA_DEFS, FLAGGED_CAMERA_INDEX, feedImageUrl } from '../data'
import { CCTV_FILTER, color } from '../theme'
import type { ClipData } from '../types'

interface Props {
  clip: ClipData
  onClose: () => void
  /**
   * If provided, shows an "Acknowledge on reader" action inside the viewer
   * (used for the live alert; omitted when viewing historical evidence).
   */
  onAck?: () => void
}

const CLIP_SECONDS = 5

/** Resolve the camera feed still for a clip by its label. */
function cameraForClip(camLabel: string) {
  return (
    CAMERA_DEFS.find((c) => c.label === camLabel) ??
    CAMERA_DEFS[FLAGGED_CAMERA_INDEX]
  )
}

/**
 * Evidence-clip viewer for a flagged detection. There is no real video stream
 * yet, so this plays the camera's feed still as a simulated CCTV clip
 * (progress scrubber, REC indicator, detection box). Swap the still for the
 * real recorded clip when streams are wired up.
 */
export function ClipModal({ clip, onClose, onAck }: Props) {
  const cam = cameraForClip(clip.cam)
  const [playing, setPlaying] = useState(true)
  const [elapsed, setElapsed] = useState(0)

  // Simulated playhead: advances while playing, loops at the end.
  useEffect(() => {
    if (!playing) return
    const id = setInterval(() => {
      setElapsed((e) => (e + 0.1 >= CLIP_SECONDS ? 0 : e + 0.1))
    }, 100)
    return () => clearInterval(id)
  }, [playing])

  // Close on Escape.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && onClose()
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [onClose])

  const pct = (elapsed / CLIP_SECONDS) * 100
  const fmt = (s: number) => `00:${String(Math.floor(s)).padStart(2, '0')}`

  return (
    <div
      onClick={onClose}
      style={{
        position: 'absolute',
        inset: 0,
        zIndex: 50,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'rgba(4,7,9,.72)',
        backdropFilter: 'blur(3px)',
        padding: 24,
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          width: 640,
          maxWidth: '100%',
          border: '1px solid rgba(255,255,255,.1)',
          borderRadius: 16,
          background: '#0d1418',
          boxShadow: '0 30px 80px rgba(0,0,0,.6)',
          overflow: 'hidden',
        }}
      >
        {/* header */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '16px 18px',
            borderBottom: '1px solid rgba(255,255,255,.06)',
          }}
        >
          <div>
            <div
              className="mono"
              style={{
                fontSize: 10,
                letterSpacing: '0.2em',
                color: color.red,
                display: 'flex',
                alignItems: 'center',
                gap: 6,
              }}
            >
              <span
                style={{
                  width: 6,
                  height: 6,
                  borderRadius: '50%',
                  background: color.red,
                  animation: 'blink 1.2s infinite',
                }}
              />
              EVIDENCE CLIP
            </div>
            <div style={{ fontSize: 15, fontWeight: 700, marginTop: 6 }}>
              {clip.cam} · {clip.loc}
            </div>
          </div>
          <button
            className="btn btn-subtle"
            onClick={onClose}
            aria-label="Close clip"
            style={{
              cursor: 'pointer',
              width: 30,
              height: 30,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              background: 'rgba(255,255,255,.06)',
              border: '1px solid rgba(255,255,255,.12)',
              color: color.textSecondary2,
              fontFamily: 'inherit',
              fontSize: 16,
              lineHeight: 1,
              borderRadius: 8,
            }}
          >
            ×
          </button>
        </div>

        {/* video area */}
        <div
          onClick={() => setPlaying((p) => !p)}
          style={{
            position: 'relative',
            width: '100%',
            aspectRatio: '1.78',
            overflow: 'hidden',
            background: color.tile,
            cursor: 'pointer',
          }}
        >
          <div
            style={{
              position: 'absolute',
              inset: 0,
              filter: CCTV_FILTER,
              backgroundImage: `url(${feedImageUrl(cam.pex)})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
            }}
          />
          {/* top scrim */}
          <div
            style={{
              position: 'absolute',
              inset: 0,
              pointerEvents: 'none',
              background:
                'linear-gradient(180deg,rgba(0,0,0,.5) 0%,transparent 30%,transparent 70%,rgba(0,0,0,.6) 100%)',
            }}
          />
          {/* detection box */}
          <div
            style={{
              position: 'absolute',
              top: '24%',
              left: '31%',
              width: '34%',
              height: '46%',
              border: `2px solid ${color.red}`,
              borderRadius: 3,
              animation: 'flagpulse 1.4s infinite',
              pointerEvents: 'none',
            }}
          >
            <span
              className="mono"
              style={{
                position: 'absolute',
                top: -18,
                left: 0,
                fontSize: 9,
                fontWeight: 600,
                color: color.screen,
                background: color.red,
                padding: '1px 5px',
                borderRadius: 3,
                whiteSpace: 'nowrap',
              }}
            >
              CONCEALMENT{clip.conf != null ? ` · ${clip.conf}%` : ''}
            </span>
          </div>
          {/* REC + timestamp */}
          <div
            className="mono"
            style={{
              position: 'absolute',
              top: 12,
              left: 14,
              display: 'flex',
              alignItems: 'center',
              gap: 7,
              fontSize: 10,
              color: '#fff',
              letterSpacing: '0.08em',
              pointerEvents: 'none',
            }}
          >
            <span
              style={{
                width: 7,
                height: 7,
                borderRadius: '50%',
                background: color.red,
                boxShadow: `0 0 8px ${color.red}`,
                animation: 'blink 1.2s infinite',
              }}
            />
            REC
          </div>
          <div
            className="mono"
            style={{
              position: 'absolute',
              top: 12,
              right: 14,
              fontSize: 10,
              color: 'rgba(255,255,255,.85)',
              letterSpacing: '0.06em',
              pointerEvents: 'none',
            }}
          >
            {clip.time} · {clip.loc.toUpperCase()}
          </div>
          {/* play / pause glyph */}
          {!playing && (
            <div
              style={{
                position: 'absolute',
                inset: 0,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                pointerEvents: 'none',
              }}
            >
              <div
                style={{
                  width: 54,
                  height: 54,
                  borderRadius: '50%',
                  background: 'rgba(10,14,16,.7)',
                  border: '1px solid rgba(255,255,255,.25)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <div
                  style={{
                    width: 0,
                    height: 0,
                    marginLeft: 4,
                    borderTop: '9px solid transparent',
                    borderBottom: '9px solid transparent',
                    borderLeft: '15px solid #fff',
                  }}
                />
              </div>
            </div>
          )}
          {/* scrubber */}
          <div
            style={{
              position: 'absolute',
              left: 14,
              right: 14,
              bottom: 12,
              display: 'flex',
              alignItems: 'center',
              gap: 10,
            }}
          >
            <span className="mono" style={{ fontSize: 10, color: '#fff' }}>
              {fmt(elapsed)}
            </span>
            <div
              style={{
                flex: 1,
                height: 4,
                borderRadius: 3,
                background: 'rgba(255,255,255,.2)',
                overflow: 'hidden',
              }}
            >
              <div
                style={{
                  width: `${pct}%`,
                  height: '100%',
                  background: color.red,
                }}
              />
            </div>
            <span
              className="mono"
              style={{ fontSize: 10, color: 'rgba(255,255,255,.7)' }}
            >
              {fmt(CLIP_SECONDS)}
            </span>
          </div>
        </div>

        {/* meta + actions */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: 16,
            padding: '14px 18px',
          }}
        >
          <div>
            <div style={{ fontSize: 13, fontWeight: 600, color: color.redTextLight }}>
              {clip.type}
            </div>
            <div
              className="mono"
              style={{ fontSize: 11, color: color.textMuted, marginTop: 3 }}
            >
              {clip.conf != null ? `${clip.conf}% AI confidence · ` : ''}edge
              buffer 12s · clip preserved as evidence
            </div>
          </div>
          {onAck && (
            <button
              className="btn btn-ack"
              onClick={() => {
                onClose()
                onAck()
              }}
              style={{
                cursor: 'pointer',
                flexShrink: 0,
                background: color.red,
                border: 'none',
                color: color.screen,
                fontFamily: 'inherit',
                fontSize: 12,
                fontWeight: 700,
                padding: '9px 16px',
                borderRadius: 9,
              }}
            >
              Acknowledge on reader →
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
