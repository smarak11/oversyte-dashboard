# Oversyte — On-Site Tablet Terminal (Phase 1)

A landscape tablet-kiosk dashboard for **Oversyte**, an AI camera-intelligence
system for gas stations / convenience stores. Built to the Phase 1 design
handoff as **React + TypeScript + Vite**.

The terminal has two states:

1. **Lock / clock-in** — the screen is locked until an employee authenticates on
   the docked fingerprint reader (this clocks them in and unlocks the terminal).
2. **Dashboard** — a live camera grid with AI detection, real-time theft/threat
   alerts, store metrics, biometric shift verification, and a live activity feed.

The docked biometric reader (right edge) mirrors the physical fingerprint
hardware. In this build, tapping it simulates a successful scan.

## Run it

```bash
npm install
npm run dev      # http://localhost:5173
npm run build    # type-check + production build to dist/
npm run preview  # serve the production build
```

Designed for a **1350 × 824** landscape kiosk (1200 × 824 screen + a 150 px
reader module). View at that resolution for a pixel-accurate result.

## Try the flow

1. Tap the reader on the right (**Tap to start shift**) → ~1.7 s scan → verified
   → the dashboard unlocks and clocks in *Marcus Tran*.
2. ~5.5 s later the demo **theft alert** auto-raises: a critical banner appears,
   **CAM 03 (Aisle 2)** is flagged with a pulsing red box, and **Active Alerts**
   goes to 1.
3. **Acknowledge on reader →** or **End shift** opens the biometric confirm
   overlay; scanning on the reader completes the action.

## Structure

```
src/
  App.tsx                 root: state machine wiring + timers + tablet frame
  terminalReducer.ts      domain state (screen / bioMode / bioStep / alert / …)
  bioVisuals.ts           derives reader + biometric ring visuals from scan state
  data.ts                 camera defs, seed activity, demo timings
  time.ts                 clock/date formatting
  theme.ts                design tokens (colors, fonts, site info)
  useNow.ts               1-second clock hook
  components/
    LockScreen.tsx        lock / clock-in screen
    Dashboard.tsx         header + banner + body + footer + overlay
    DashboardHeader.tsx   logo, clock, user chip, End shift
    AlertBanner.tsx       critical alert banner
    CameraGrid.tsx        3×3 grid (8 cameras + AI detection tile)
    CameraTile.tsx        single camera feed + status
    RightRail.tsx         metrics, shift verification, activity timeline
    ActivityItem.tsx      one timeline event
    BioOverlay.tsx        end-shift / acknowledge confirm modal
    ReaderModule.tsx      docked fingerprint reader
    Wordmark.tsx          Oversyte logo lockup
```

## Wiring to production

This build faithfully reproduces the design with **mocked** data. To ship, replace:

- **Camera feeds** — every tile and the pop-out render a real moving
  `<video>` (autoplay / muted / loop) via `CameraFeed.tsx`, with the still as
  the poster and as a graceful fallback if the video is missing or fails to
  load. The seeded clips in `data.ts` (`CAMERA_DEFS[i].video`) are
  **gas-station / convenience-store sample loops** (free Pexels stock, no
  attribution) matched to each camera's location — storefront, register, aisle,
  fuel pumps, coolers, stockroom, entrance, parking lot. Replace each with the
  camera's real stream: a direct MP4/HLS URL, or attach an HLS (hls.js) /
  WebRTC track to the `<video>` element inside `CameraFeed`. Toggle the whole
  layer with `VIDEO_FEEDS_ENABLED` (false → still image + subtle `feedlive`
  drift).
  - *Autoplay:* muted video autoplays by default in Chrome/Edge; `CameraFeed`
    also starts playback on the first user interaction as a fallback for
    stricter policies. (Note: background/hidden tabs throttle playback — that's
    a browser behavior, not a bug.)
- **24/7 recording** — every feed shows as continuously recording (`REC` badge
  per tile + in the pop-out, plus the footer and metrics). This is
  representation only — the actual capture and retention run on the on-site
  **NVR + storage backend** (see the `RECORDING` config in `data.ts`: duty
  cycle, edge buffer, retention). Wire the badges to live device/recording
  status.
- **Detection events** — the `DEMO_ALERT_DELAY_MS` timer in `App.tsx` with a
  real alert stream (websocket / push) that dispatches `RAISE_ALERT`.
- **Biometric device** — the simulated scan in `App.tsx`'s `readerTap` with the
  fingerprint SDK driving `SCAN_START` → `SCAN_MATCHED` → `FINISH`.
- **Employee directory / shift + payroll** — the hard-coded `Marcus Tran` user
  created in the reducer's `finish('unlock')`.
- **Store metrics** — the static values in `RightRail.tsx` (`8/8`, `$186`, …).
