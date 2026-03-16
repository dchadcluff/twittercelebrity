# Phase 3: Reveal and Post-Reveal - Context

**Gathered:** 2026-03-15
**Status:** Ready for planning

<domain>
## Phase Boundary

Enhance the existing reveal screen with a cinematic three-act sequence (staggered card exit → pause → @chadcluff entrance), add confetti burst, neon spotlight, and complete the post-reveal screen with Share on X, Replay, and witty bio. A basic reveal already exists in home.tsx — this phase upgrades it and adds missing CTAs.

</domain>

<decisions>
## Implementation Decisions

### Share on X
- Pre-filled tweet text: "Think you know who the real Twitter Celebrity is? Find out → twittercelebrity.com"
- Use X Web Intent URL (https://x.com/intent/tweet?text=...)
- Button styled to match cyberpunk theme

### Confetti
- Neon cyberpunk color scheme: cyan, pink, yellow particles matching the theme
- Explosive burst — big dramatic cannon blast matching the reveal energy
- Use canvas-confetti library (already researched, 3KB)
- Fire during the reveal sequence, timed with @chadcluff entrance

### Replay
- Fresh random 6 celebrities each replay — different game every time
- Reset state via gameReducer (need to add REPLAY action)
- Smooth transition back to browsing phase

### Three-act reveal (already partially built)
- Act 1: Browsing grid fades out (already works via AnimatePresence mode="wait")
- Act 2: Deliberate pause before entrance (currently 0.5s delay — may need tuning)
- Act 3: @chadcluff hero card scales in with title (already built)
- Confetti fires during Act 3

### Bio/tagline
- Claude's discretion on witty copy for the hero screen
- Current bio: "The one. The only. You dismissed everyone else for this." — can be kept or improved

### Claude's Discretion
- Exact confetti particle count, spread, and timing
- Three-act timing adjustments (delays between acts)
- Bio/tagline copy on hero screen
- Share button and Replay button styling
- Neon spotlight intensity on hero card (currently has box-shadow glow)

</decisions>

<canonical_refs>
## Canonical References

**Downstream agents MUST read these before planning or implementing.**

### Animation and reveal
- `.planning/research/ARCHITECTURE.md` — Phase-driven state machine (browsing → reveal → post), useAnimation for reveal orchestration
- `.planning/research/FEATURES.md` — Three-act reveal sequence, confetti timing, share Web Intent pattern
- `.planning/research/STACK.md` — canvas-confetti library (3KB), Framer Motion useAnimation for chained sequences

### Prior phase context
- `.planning/phases/01-foundation/01-CONTEXT.md` — Celebrity roster, deploy workflow
- `.planning/phases/02-card-game-mechanics/02-CONTEXT.md` — Card layout, dismiss mechanics, game state

</canonical_refs>

<code_context>
## Existing Code Insights

### Reusable Assets
- `app/routes/home.tsx` — Already has basic reveal screen with AnimatePresence mode="wait", hero card, title, and Follow CTA. Phase 3 enhances this.
- `app/state/gameReducer.ts` — Has `GamePhase` type with "reveal" and "post" phases. REPLAY action type declared but not implemented.
- `app/data/chadcluff.ts` — CHADCLUFF data with bio, handle, photoPath
- `app/components/StickyHeader.tsx` — Sticky header (stays during reveal)

### Established Patterns
- Framer Motion for all animations (motion.div, AnimatePresence, initial/animate/exit)
- useReducer + dispatch pattern for game state
- Tailwind v4 cyberpunk tokens (neon-cyan, neon-pink, neon-yellow, cyber-black, cyber-panel)
- Auto-dismiss timer in home.tsx useEffect (stops when phase !== "browsing")

### Integration Points
- `app/routes/home.tsx` lines 65-135 — The reveal section to enhance
- `app/state/gameReducer.ts` — REPLAY action needs implementation
- `canvas-confetti` — needs npm install

</code_context>

<specifics>
## Specific Ideas

- Confetti should feel like a "you won!" moment — big neon explosion
- Share tweet uses mystery hook to drive traffic: "Think you know who the real Twitter Celebrity is?"
- Replay gives a fresh set of 6 random celebrities — different experience each time

</specifics>

<deferred>
## Deferred Ideas

None — discussion stayed within phase scope

</deferred>

---

*Phase: 03-reveal-and-post-reveal*
*Context gathered: 2026-03-15*
