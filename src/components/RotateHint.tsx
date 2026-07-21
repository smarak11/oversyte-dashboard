import { color } from '../theme'
import { Wordmark } from './Wordmark'

interface Props {
  onDismiss: () => void
}

/**
 * Shown on phones held in portrait: the terminal is a landscape kiosk design,
 * so it reads best rotated. Non-blocking — "View anyway" dismisses it for
 * users who can't (or don't want to) rotate.
 */
export function RotateHint({ onDismiss }: Props) {
  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 100,
        background:
          'radial-gradient(700px 500px at 50% 30%,#0e1620 0%,#05080a 75%)',
        color: color.textPrimary,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 26,
        padding: 32,
        textAlign: 'center',
      }}
    >
      <Wordmark markSize={11} fontSize={16} letterSpacing="0.34em" gap={12} />

      {/* rotating phone glyph */}
      <div
        style={{
          width: 66,
          height: 108,
          border: `2px solid ${color.green}`,
          borderRadius: 12,
          position: 'relative',
          animation: 'rotatehint 2.4s ease-in-out infinite',
          boxShadow: '0 0 24px rgba(63,216,138,.25)',
          marginTop: 8,
        }}
      >
        <span
          style={{
            position: 'absolute',
            bottom: 7,
            left: '50%',
            transform: 'translateX(-50%)',
            width: 16,
            height: 4,
            borderRadius: 3,
            background: 'rgba(63,216,138,.6)',
          }}
        />
      </div>

      <div>
        <div style={{ fontSize: 18, fontWeight: 600 }}>Rotate your device</div>
        <div
          className="mono"
          style={{
            fontSize: 12,
            color: color.textMuted2,
            marginTop: 8,
            lineHeight: 1.6,
            maxWidth: 300,
          }}
        >
          This on-site terminal is built for a landscape screen. Turn your phone
          sideways for the full view.
        </div>
      </div>

      <button
        className="btn btn-subtle"
        onClick={onDismiss}
        style={{
          cursor: 'pointer',
          background: 'rgba(255,255,255,.05)',
          border: '1px solid rgba(255,255,255,.14)',
          color: color.textSecondary2,
          fontFamily: 'inherit',
          fontSize: 12,
          fontWeight: 500,
          padding: '10px 20px',
          borderRadius: 9,
        }}
      >
        View anyway →
      </button>
    </div>
  )
}
