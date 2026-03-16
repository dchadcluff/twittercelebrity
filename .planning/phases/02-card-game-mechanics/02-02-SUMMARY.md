---
phase: 02-card-game-mechanics
plan: 02
subsystem: ui
tags: [react, framer-motion, tailwind, drag-gesture, animation, cyberpunk]

# Dependency graph
requires:
  - phase: 02-01
    provides: gameReducer types, CelebrityCard interface, color tokens, framer-motion installed
provides:
  - DismissButton component with 44px touch target and neon-pink X icon
  - CelebrityCard component with drag-to-dismiss, tilt, exit animations, and cyberpunk styling
affects: [03-reveal-animation, 04-polish]

# Tech tracking
tech-stack:
  added: []
  patterns:
    - useMotionValue + useTransform for real-time drag tilt without React re-renders
    - dragConstraints + dragElastic + dragTransition for snap-back spring physics
    - React.memo on CelebrityCard to prevent full list re-renders on each dismiss
    - Inline style touchAction:none to prevent mobile scroll conflict with drag
    - Image error fallback with state flag + initials placeholder

key-files:
  created:
    - app/components/DismissButton.tsx
    - app/components/CelebrityCard.tsx
  modified: []

key-decisions:
  - "Separate outer layout wrapper not needed in FM 12 — layout+exit on same motion.div works correctly"
  - "Image error fallback uses React useState (imgError flag) rather than DOM manipulation for React idiom compliance"
  - "CelebrityCard exported as named export via alias to preserve React.memo wrapping"

patterns-established:
  - "DismissButton: outer div for touch target, inner button for visual circle, stopPropagation on click"
  - "CelebrityCard: x MotionValue + rotate transform wired to drag x position for zero-render-jank tilt"
  - "isChad gates: drag prop and DismissButton render both conditioned on !card.isChad"

requirements-completed: [CARD-02, CARD-03, CARD-04, CARD-05]

# Metrics
duration: 5min
completed: 2026-03-16
---

# Phase 2 Plan 02: CelebrityCard and DismissButton Summary

**Framer Motion drag-to-dismiss CelebrityCard with +/-15deg tilt, snap-back spring, exit animation, and neon-pink DismissButton with 44px touch target**

## Performance

- **Duration:** ~5 min
- **Started:** 2026-03-16T01:15:00Z
- **Completed:** 2026-03-16T01:20:01Z
- **Tasks:** 2
- **Files modified:** 2

## Accomplishments
- DismissButton: 44px accessible touch target, 28px neon-pink X circle, hover glow, neon-cyan focus ring
- CelebrityCard: full profile display (photo, handle, name, bio, followers) with cyberpunk neon styling
- Drag-to-dismiss with 120px offset / 500px/s velocity thresholds and spring snap-back
- Real-time +/-15deg tilt via useMotionValue + useTransform (zero React re-renders during drag)
- Staggered card entry (index*60ms), exit animation (x:600, opacity:0, rotate:30, 250ms easeIn)
- isChad card: neon-yellow border, drag disabled, no DismissButton
- Image error fallback renders celebrity initials on cyber-surface background

## Task Commits

Each task was committed atomically:

1. **Task 1: Create DismissButton component** - `cfd3e70` (feat)
2. **Task 2: Create CelebrityCard component** - `e9be5fb` (feat)

## Files Created/Modified
- `app/components/DismissButton.tsx` - 44px touch target X dismiss button with neon-pink icon and hover/focus states
- `app/components/CelebrityCard.tsx` - Interactive celebrity card with framer-motion drag, tilt, exit animation, and full data display

## Decisions Made
- Layout + exit coexistence on the same motion.div works in FM 12.x — no nested wrapper pattern needed (research noted this as uncertain; verified by clean compile and pattern conformance)
- Image fallback uses React `useState` with `imgError` boolean rather than imperative DOM hiding — consistent with React idioms
- CelebrityCard is exported as `CelebrityCard` via alias after `React.memo` wrap to keep the exported name clean

## Deviations from Plan

None - plan executed exactly as written.

## Issues Encountered

None.

## User Setup Required

None - no external service configuration required.

## Next Phase Readiness
- DismissButton and CelebrityCard are complete and ready for use in CardGrid (Plan 03)
- Both components type-check cleanly with the CelebrityCard interface from app/state/types.ts
- AnimatePresence wrapping happens in CardGrid (next plan) — these components are designed to work within that wrapper

---
*Phase: 02-card-game-mechanics*
*Completed: 2026-03-16*
