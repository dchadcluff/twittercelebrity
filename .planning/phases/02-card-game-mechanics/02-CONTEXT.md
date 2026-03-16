# Phase 2: Card Game Mechanics - Context

**Gathered:** 2026-03-15
**Status:** Ready for planning

<domain>
## Phase Boundary

Fully playable card-dismissal game where users can tap or swipe away all celebrity cards with fluid tactile feedback and cyberpunk card styling on both mobile and desktop. Cards display in a responsive grid, dismiss with animations, and reflow smoothly. The reveal sequence (Phase 3) is NOT in scope — this phase ends when all non-chadcluff cards can be dismissed and @chadcluff remains.

</domain>

<decisions>
## Implementation Decisions

### Card layout
- Responsive CSS grid: 4 columns on desktop, 2 columns on mobile
- Medium card size: shows profile photo, @handle, display name, bio snippet — may scroll on mobile
- When a card is dismissed, remaining cards reflow with smooth animation to fill gaps
- Sticky header: "Twitter Celebrity" title stays pinned at top while cards scroll below
- Subtle instruction hint (e.g., "Tap X to eliminate") that fades after first dismiss

### Card visual design
- Claude's discretion on exact card styling within cyberpunk theme
- Must use existing neon tokens from `app/styles/app.css` (cyber-black, neon-cyan, neon-pink, neon-yellow)
- Cards should show: photo, @handle, display name, bio snippet, follower count (per CARD-02)

### Dismiss mechanics
- X button in card corner for tap dismiss (all devices)
- Swipe-to-dismiss gesture on touch devices
- Cards tilt during swipe drag for tactile feedback (Framer Motion `drag` prop)
- Claude's discretion on: swipe threshold, dismiss direction, animation timing, exit animation style

### Game state
- Cards randomized on every page load (decided in Phase 1)
- @chadcluff card cannot be dismissed — always the last remaining card
- Track dismiss count for reveal trigger (Phase 3 will use this)
- When all 14 non-chadcluff cards are dismissed, the game state transitions to "reveal" — but the reveal animation itself is Phase 3

### Staggered entry animation
- Cards animate in with stagger on page load (not all appearing simultaneously)
- Claude's discretion on timing and animation style

### Claude's Discretion
- Exact card border, shadow, and glow styling
- Swipe threshold distance, dismiss velocity, and exit animation direction
- Staggered entry timing and easing
- Instruction hint text, position, and fade timing
- Grid gap spacing and card aspect ratio
- How the X button looks (icon, position, hover state)

</decisions>

<canonical_refs>
## Canonical References

**Downstream agents MUST read these before planning or implementing.**

### Animation and gestures
- `.planning/research/FEATURES.md` — Swipe + X dismiss shared handler, drag tilt feedback, AnimatePresence exit animations
- `.planning/research/ARCHITECTURE.md` — Phase-driven state machine (browsing → reveal → post), component boundaries, useReducer pattern
- `.planning/research/PITFALLS.md` — AnimatePresence key/exit pitfalls, swipe vs scroll conflict on mobile (touch-action: none), dispatch-before-exit-animation bug

### Stack
- `.planning/research/STACK.md` — Framer Motion for gestures + animation, Tailwind v4 setup

### Phase 1 decisions
- `.planning/phases/01-foundation/01-CONTEXT.md` — Celebrity roster decisions, randomization, @chadcluff always last

</canonical_refs>

<code_context>
## Existing Code Insights

### Reusable Assets
- `app/state/types.ts` — `CelebrityCard` interface with id, handle, displayName, bio, followerCount, photoPath, isChad
- `app/data/celebrities.ts` — 14 celebrity entries, all `isChad: false`
- `app/data/chadcluff.ts` — @chadcluff entry with `isChad: true`
- `app/styles/app.css` — Tailwind v4 `@theme` with cyberpunk tokens (cyber-black, neon-cyan, neon-pink, neon-yellow, cyber-text, cyber-muted)

### Established Patterns
- React Router 7 SPA mode (`ssr: false`)
- Tailwind v4 CSS-first with `@theme` directive
- Static data in TypeScript files under `app/data/`
- Types under `app/state/`

### Integration Points
- `app/routes/home.tsx` — Currently a placeholder, will become the game page
- `app/root.tsx` — Imports `app.css`, renders `<Outlet />`
- `public/images/celebrities/` — 15 placeholder JPEGs (will need real photos eventually)

</code_context>

<specifics>
## Specific Ideas

- Grid reflow when cards are dismissed should feel satisfying — smooth slide into gaps, not jarring snaps
- The hint text should be unobtrusive — don't distract from the cyberpunk visual experience
- Card tilt during swipe should make it feel like you're physically flipping a card away

</specifics>

<deferred>
## Deferred Ideas

None — discussion stayed within phase scope

</deferred>

---

*Phase: 02-card-game-mechanics*
*Context gathered: 2026-03-15*
