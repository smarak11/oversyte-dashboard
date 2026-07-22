import { useEffect } from 'react'
import { RECORDING } from '../data'
import { color } from '../theme'
import { hms } from '../time'
import { useNow } from '../useNow'
import { useMobile } from '../MobileContext'
import type { CameraDef } from '../types'
import { CameraFeed } from './CameraFeed'

interface Props {
  cam: CameraDef
  flagged: boolean
  onClose: () => void
}

/**
 * Detailed live pop-out for a single camera feed. There is no real video
 * stream yet, so it enlarges the feed still with a live overlay (LIVE badge,
 * ticking timestamp, detection box when flagged). Swap the still for the real
 * stream when feeds are wired up.
 */
export function CameraModal({ cam, flagged, onClose }: Props) {
  const now = useNow()

  // Close on Escape.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && onClose()
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [onClose])

  const accent = flagged ? color.red : color.green
  const mobile = useMobile()

  return (
    <div
      onClick={onClose}
      style={{
        position: mobile ? 'fixed' : 'absolute',
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
          width: 760,
          maxWidth: '100%',
          border: `1px solid ${flagged ? 'rgba(255,81,69,.35)' : 'rgba(255,255,255,.1)'}`,
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
                color: accent,
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
                  background: accent,
                  boxShadow: `0 0 8px ${accent}`,
                  animation: `blink ${flagged ? '1.2s' : '1.6s'} infinite`,
                }}
              />
              {flagged ? 'FLAGGED FEED' : 'LIVE FEED'}
            </div>
            <div style={{ fontSize: 15, fontWeight: 700, marginTop: 6 }}>
              {cam.label} · {cam.loc}
            </div>
          </div>
          <button
            className="btn btn-subtle"
            onClick={onClose}
            aria-label="Close camera"
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

        {/* feed */}
        <div
          style={{
            position: 'relative',
            width: '100%',
            aspectRatio: '1.78',
            overflow: 'hidden',
            background: color.tile,
          }}
        >
          <CameraFeed cam={cam} />
          {/* scrim */}
          <div
            style={{
              position: 'absolute',
              inset: 0,
              pointerEvents: 'none',
              background:
                'linear-gradient(180deg,rgba(0,0,0,.5) 0%,transparent 28%,transparent 72%,rgba(0,0,0,.55) 100%)',
            }}
          />
          {/* detection box when flagged */}
          {flagged && (
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
                CONCEALMENT · 94%
              </span>
            </div>
          )}
          {/* REC + LIVE / FLAGGED badge */}
          <div
            className="mono"
            style={{
              position: 'absolute',
              top: 12,
              left: 14,
              display: 'flex',
              alignItems: 'center',
              gap: 8,
              fontSize: 10,
              color: '#fff',
              letterSpacing: '0.08em',
              pointerEvents: 'none',
            }}
          >
            <span style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
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
            </span>
            <span style={{ color: 'rgba(255,255,255,.4)' }}>·</span>
            <span style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
              <span
                style={{
                  width: 7,
                  height: 7,
                  borderRadius: '50%',
                  background: accent,
                  boxShadow: `0 0 8px ${accent}`,
                  animation: `blink ${flagged ? '1.2s' : '1.6s'} infinite`,
                }}
              />
              {flagged ? 'FLAGGED' : 'LIVE'}
            </span>
          </div>
          {/* live timestamp */}
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
            {hms(now)} · {cam.loc.toUpperCase()}
          </div>
          {/* camera label bottom-left */}
          <div
            className="mono"
            style={{
              position: 'absolute',
              bottom: 12,
              left: 14,
              fontSize: 11,
              fontWeight: 600,
              color: '#fff',
              letterSpacing: '0.06em',
              pointerEvents: 'none',
            }}
          >
            {cam.label}
          </div>
        </div>

        {/* stat strip */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(4,1fr)',
            gap: 1,
            background: 'rgba(255,255,255,.06)',
          }}
        >
          <FeedStat label="RESOLUTION" value="1080p" />
          <FeedStat label="FRAME RATE" value="24 FPS" />
          <FeedStat
            label="AI MONITORING"
            value={flagged ? 'ALERT' : 'ACTIVE'}
            valueColor={accent}
          />
          <FeedStat
            label="RECORDING"
            value={RECORDING.duty}
            valueColor={color.green}
          />
        </div>
      </div>
    </div>
  )
}

function FeedStat({
  label,
  value,
  valueColor,
}: {
  label: string
  value: string
  valueColor?: string
}) {
  return (
    <div style={{ background: '#0d1418', padding: '12px 14px' }}>
      <div
        className="mono"
        style={{ fontSize: 9, letterSpacing: '0.1em', color: color.textMuted2 }}
      >
        {label}
      </div>
      <div
        className="mono"
        style={{
          fontSize: 14,
          fontWeight: 600,
          marginTop: 4,
          color: valueColor ?? color.textSecondary,
        }}
      >
        {value}
      </div>
    </div>
  )
}
