import { color } from '../theme'
import type { CameraDef } from '../types'
import { CameraFeed } from './CameraFeed'

interface Props {
  cam: CameraDef
  flagged: boolean
  /** Position in the grid — used to desync the live-motion animation. */
  index: number
  onOpen: () => void
}

export function CameraTile({ cam, flagged, index, onOpen }: Props) {
  return (
    <div
      className={flagged ? 'mono' : 'mono hover-lift'}
      onClick={onOpen}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault()
          onOpen()
        }
      }}
      title={`${cam.label} · ${cam.loc} — open detailed view`}
      style={{
        position: 'relative',
        display: 'flex',
        flexDirection: 'column',
        border: flagged
          ? `1px solid ${color.red}`
          : '1px solid rgba(255,255,255,.08)',
        borderRadius: 11,
        overflow: 'hidden',
        color: color.textSecondary,
        background: color.tile,
        cursor: 'pointer',
        animation: flagged ? 'flagpulse 1.4s infinite' : undefined,
      }}
    >
      {/* feed */}
      <div
        style={{
          position: 'relative',
          width: '100%',
          aspectRatio: '1.78',
          overflow: 'hidden',
        }}
      >
        <CameraFeed cam={cam} index={index} />
        {/* top scrim */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            pointerEvents: 'none',
            background:
              'linear-gradient(180deg,rgba(0,0,0,.4) 0%,transparent 34%)',
          }}
        />
        {/* continuous 24/7 recording indicator */}
        <div
          className="mono"
          aria-label="Recording"
          style={{
            position: 'absolute',
            top: 6,
            left: 8,
            display: 'flex',
            alignItems: 'center',
            gap: 4,
            fontSize: 8,
            letterSpacing: '0.1em',
            color: '#fff',
            textShadow: '0 1px 2px rgba(0,0,0,.7)',
            pointerEvents: 'none',
          }}
        >
          <span
            style={{
              width: 6,
              height: 6,
              borderRadius: '50%',
              background: color.red,
              boxShadow: `0 0 6px ${color.red}`,
              animation: 'blink 1.2s infinite',
            }}
          />
          REC
        </div>
        {/* expand affordance (brightens with the tile on hover) */}
        <div
          className="cam-expand"
          aria-hidden
          style={{
            position: 'absolute',
            top: 6,
            right: 6,
            width: 18,
            height: 18,
            borderRadius: 5,
            background: 'rgba(10,14,16,.55)',
            border: '1px solid rgba(255,255,255,.18)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: 11,
            lineHeight: 1,
            color: 'rgba(230,237,240,.9)',
            pointerEvents: 'none',
          }}
        >
          ⤢
        </div>
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
          />
        )}
      </div>

      {/* info bar */}
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: 3,
          padding: '7px 10px',
          borderTop: '1px solid rgba(255,255,255,.07)',
          background: color.panelInfo,
        }}
      >
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            gap: 6,
          }}
        >
          <span
            style={{
              fontSize: 10,
              fontWeight: 600,
              color: color.textPrimary,
              letterSpacing: '0.04em',
            }}
          >
            {cam.label}
          </span>
          {flagged ? (
            <StatusPill
              label="FLAGGED"
              textColor={color.redText}
              dotBlink="1.2s"
            />
          ) : (
            <StatusPill label="LIVE" textColor={color.green} dotBlink="1.6s" />
          )}
        </div>
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            gap: 6,
          }}
        >
          <span
            style={{ fontSize: 9, color: color.textMuted, letterSpacing: '0.04em' }}
          >
            {cam.loc}
          </span>
        </div>
      </div>
    </div>
  )
}

function StatusPill({
  label,
  textColor,
  dotBlink,
}: {
  label: string
  textColor: string
  dotBlink: string
}) {
  return (
    <span
      style={{
        fontSize: 9,
        fontWeight: label === 'FLAGGED' ? 600 : 500,
        color: textColor,
        display: 'flex',
        alignItems: 'center',
        gap: 4,
      }}
    >
      <span
        style={{
          width: 6,
          height: 6,
          borderRadius: '50%',
          background: color.red,
          animation: `blink ${dotBlink} infinite`,
        }}
      />
      {label}
    </span>
  )
}
