# Phase 3: Reveal and Post-Reveal - Research

**Researched:** 2026-03-15
**Domain:** Framer Motion orchestrated reveal sequence, canvas-confetti, X Web Intent share, game state REPLAY action
**Confidence:** HIGH

---

<user_constraints>
## User Constraints (from CONTEXT.md)

### Locked Decisions
- **Share on X:** Pre-filled tweet text: "Think you know who the real Twitter Celebrity is? Find out → twittercelebrity.com". Use X Web Intent URL (https://x.com/intent/tweet?text=...). Button styled to match cyberpunk theme.
- **Confetti:** Neon cyberpunk color scheme: cyan, pink, yellow particles matching the theme. Explosive burst — big dramatic cannon blast. Use canvas-confetti library (already researched, 3KB). Fire during the reveal sequence, timed with @chadcluff entrance.
- **Replay:** Fresh random 6 celebrities each replay — different game every time. Reset state via gameReducer (need to add REPLAY action). Smooth transition back to browsing phase.
- **Three-act reveal:** Act 1: Browsing grid fades out (already works via AnimatePresence mode="wait"). Act 2: Deliberate pause before entrance (currently 0.5s delay — may need tuning). Act 3: @chadcluff hero card scales in with title (already built). Confetti fires during Act 3.

### Claude's Discretion
- Exact confetti particle count, spread, and timing
- Three-act timing adjustments (delays between acts)
- Bio/tagline copy on hero screen
- Share button and Replay button styling
- Neon spotlight intensity on hero card (currently has box-shadow glow)

### Deferred Ideas (OUT OF SCOPE)
None — discussion stayed within phase scope
</user_constraints>

---

<phase_requirements>
## Phase Requirements

| ID | Description | Research Support |
|----|-------------|-----------------|
| REVL-01 | When all non-chadcluff cards are dismissed, dramatic reveal sequence begins | gameReducer already sets phase="reveal" when nonChadRemaining.length===0; home.tsx already conditionally renders reveal section when phase !== "browsing" |
| REVL-02 | Remaining cards fly away in staggered exit animation | AnimatePresence mode="wait" already handles browsing→reveal transition with opacity fade; REVL-02 requires the existing exit animation to feel more cinematic — the current exit is a simple opacity:0 fade, which may be sufficient given the auto-dismiss already animates cards off one by one before the reveal fires |
| REVL-03 | Deliberate pause between card exits and @chadcluff entrance | Currently 0.5s delay on the reveal motion.div initial animate; tuning available via the delay value in the animate transition |
| REVL-04 | @chadcluff card grows into center stage with hero treatment | Already built: scale 0.6→1 with spring easing [0.34,1.56,0.64,1] at delay 1.2s; hero card in home.tsx lines 91-119 |
| REVL-05 | Confetti burst fires during reveal via canvas-confetti | canvas-confetti not yet installed; needs `npm install canvas-confetti @types/canvas-confetti`; fires in useEffect on phase transition inside a setTimeout timed with Act 3 entrance |
| REVL-06 | Neon spotlight/glow effect highlights the hero card | Currently box-shadow glow on hero card (shadow-[0_0_40px_rgba(255,255,0,0.4)]); enhancement = animated pulse glow on entrance using Framer Motion animate on boxShadow or a CSS keyframe |
| POST-01 | Follow @chadcluff CTA button links to Twitter/X profile | Already built in home.tsx line 122; needs to persist/improve in the final implementation |
| POST-02 | Share on X button generates pre-filled tweet via Web Intent | Not yet built; URL: `https://x.com/intent/tweet?text=Think%20you%20know%20who%20the%20real%20Twitter%20Celebrity%20is%3F%20Find%20out%20%E2%86%92%20twittercelebrity.com` |
| POST-03 | Replay button resets game and shuffles card order | Not yet built; gameReducer has REPLAY action declared but not implemented in switch statement |
| POST-04 | Witty bio/tagline section displays on the hero screen | Current bio in chadcluff.ts: "The one. The only. You dismissed everyone else for this." — may be enhanced; tagline is separate from bio and can be hardcoded in the reveal JSX |
</phase_requirements>

---

## Summary

Phase 3 is primarily an enhancement task, not a rebuild. The core reveal structure already exists in `app/routes/home.tsx` lines 65-135: the AnimatePresence mode="wait" transition, the hero card with spring animation, the neon glow box-shadow, and the Follow CTA are all working. This phase adds three missing capabilities: (1) confetti burst via canvas-confetti, (2) Share on X and Replay CTAs in the post-reveal section, and (3) REPLAY action implementation in the game reducer.

The most significant new code is the confetti integration — a useEffect that fires `confetti()` when `state.phase` transitions to `reveal`, timed to coincide with the hero card entrance at ~1.2-1.5 seconds. The REPLAY action needs one additional case in the gameReducer switch that calls `initializeGame()` to get a freshly shuffled deck. The CTA buttons (Share, Replay) are straightforward anchor and button elements styled with the existing Tailwind cyberpunk tokens.

The state machine currently only has "browsing" and "reveal" phases handled in the UI — the CONTEXT.md and gameReducer reference a "post" phase, but home.tsx currently renders the same reveal content for all non-browsing phases. This phase can either keep that single reveal/post section or introduce the explicit "post" phase transition after the reveal animation completes, gating the CTAs to appear after the hero is fully on screen.

**Primary recommendation:** Add confetti + CTAs to the existing reveal section in home.tsx. Implement REPLAY in gameReducer. Keep the phase model simple — "reveal" state shows hero + CTAs together after animation delay, no separate "post" phase transition needed unless the planner wants the explicit separation.

---

## Standard Stack

### Core (already installed)
| Library | Version | Purpose | Status |
|---------|---------|---------|--------|
| framer-motion | ^12.36.0 | All animations: hero entrance, glow pulse, staggered CTA fade-in | Installed |
| tailwindcss | ^4.1.13 | Cyberpunk styling tokens (neon-cyan, neon-pink, neon-yellow) | Installed |
| react / react-dom | ^19.2.4 | UI rendering | Installed |

### Needs Installation
| Library | Version | Purpose | Why This One |
|---------|---------|---------|--------------|
| canvas-confetti | ^1.9.4 | One-shot confetti burst during reveal | 3KB, zero deps, fire-and-forget; confirmed as the locked choice |
| @types/canvas-confetti | latest | TypeScript types for canvas-confetti | Required for type-safe options object |

**Installation:**
```bash
npm install canvas-confetti
npm install -D @types/canvas-confetti
```

---

## Architecture Patterns

### Existing Structure to Enhance
```
app/routes/home.tsx          # Single file containing ALL phase rendering
app/state/gameReducer.ts     # State machine — REPLAY case needs adding
app/data/chadcluff.ts        # Hero data (bio, handle, photoPath)
```

### Pattern 1: Confetti as useEffect Side-Effect

**What:** canvas-confetti is a plain function, not a React component. Fire it in a useEffect that watches `state.phase`. When phase becomes "reveal", set a setTimeout matching the hero card entrance delay (~1.2s) then call `confetti()`.

**When to use:** Any time a side-effect must be time-coordinated with a Framer Motion animation that is driven by `delay` values rather than `useAnimation` controls.

**Example:**
```typescript
// Inside home.tsx, after the existing useReducer
import confetti from "canvas-confetti";

useEffect(() => {
  if (state.phase !== "reveal") return;
  // Fire after hero card has started its entrance (delay: 1.2s + some lead time)
  const timer = setTimeout(() => {
    confetti({
      particleCount: 150,
      spread: 80,
      startVelocity: 55,
      origin: { x: 0.5, y: 0.4 },
      colors: ["#00f5ff", "#ff006e", "#ffd700"], // neon-cyan, neon-pink, neon-yellow
      disableForReducedMotion: true,
    });
  }, 1400);
  return () => clearTimeout(timer);
}, [state.phase]);
```

**Confidence:** HIGH — canvas-confetti GitHub README confirms all options. `disableForReducedMotion: true` is the correct key per the official API.

### Pattern 2: REPLAY Action in gameReducer

**What:** The REPLAY action type is already declared in the `GameAction` union but the switch statement has no case for it — it falls through to `default: return state`. Adding the case calls `initializeGame()` to produce a freshly shuffled deck.

**Example:**
```typescript
// app/state/gameReducer.ts — add inside switch block
case "REPLAY":
  return initializeGame();
```

`initializeGame()` already does everything needed: shuffles CELEBRITIES, picks 6, splices CHADCLUFF in at index 3. Calling it fresh gives a different 6-celebrity mix each replay, matching the locked requirement.

**Confidence:** HIGH — directly reading the existing code.

### Pattern 3: CTA Buttons with Staggered Fade-In

**What:** Share and Replay buttons appear after the hero card has fully landed. Use Framer Motion `initial/animate` with `delay` values that chain after the existing hero animation delays.

**Existing animation timing in home.tsx:**
- Reveal container: delay 0.5s, duration 0.8s
- Title (h2): delay 0.8s, duration 0.6s
- Hero card: delay 1.2s, duration 0.7s (arrives ~1.9s)
- Follow CTA: delay 2.0s, duration 0.5s

**New CTA placement:** Share and Replay buttons should appear at delay ~2.3s (after Follow CTA at 2.0s). A horizontal row of three buttons works at this scale.

**Example:**
```typescript
<motion.div
  initial={{ opacity: 0, y: 10 }}
  animate={{
    opacity: 1,
    y: 0,
    transition: { delay: 2.3, duration: 0.5 },
  }}
  className="mt-4 flex gap-4 flex-wrap justify-center"
>
  {/* Share on X */}
  <a
    href={`https://x.com/intent/tweet?text=${encodeURIComponent(
      "Think you know who the real Twitter Celebrity is? Find out → twittercelebrity.com"
    )}`}
    target="_blank"
    rel="noopener noreferrer"
    className="px-6 py-3 rounded-lg bg-neon-pink text-cyber-black font-bold hover:shadow-[0_0_20px_rgba(255,0,110,0.5)] transition-shadow"
  >
    Share on X
  </a>
  {/* Replay */}
  <button
    onClick={() => dispatch({ type: "REPLAY" })}
    className="px-6 py-3 rounded-lg border-2 border-neon-cyan text-neon-cyan font-bold hover:bg-neon-cyan hover:text-cyber-black transition-colors"
  >
    Play Again
  </button>
</motion.div>
```

**Confidence:** HIGH — uses established patterns from existing home.tsx code.

### Pattern 4: X Web Intent URL

**What:** The Share on X button uses the Twitter/X Web Intent URL to pre-fill tweet text without requiring any API key or OAuth.

**URL format:**
```
https://x.com/intent/tweet?text=ENCODED_TEXT
```

**Implementation:**
```typescript
const shareText = "Think you know who the real Twitter Celebrity is? Find out → twittercelebrity.com";
const shareUrl = `https://x.com/intent/tweet?text=${encodeURIComponent(shareText)}`;
```

The `→` character (U+2192) will be percent-encoded by `encodeURIComponent`. This is correct — X's Web Intent URL accepts percent-encoded text. Use `encodeURIComponent`, not manual encoding.

**Confidence:** HIGH — X Web Intent URL is a well-documented public API; no auth required.

### Anti-Patterns to Avoid

- **Don't use `window.open()` for the share link:** Use a plain `<a>` tag with `target="_blank"`. Mobile browsers block `window.open()` calls that aren't in direct event handlers, and they're harder to style.
- **Don't build a custom canvas overlay for confetti:** canvas-confetti handles z-index and canvas creation automatically. Do not create a React `<canvas>` element for it — just call `confetti()`.
- **Don't add a separate "post" phase transition just to show CTA buttons:** The existing reveal section already renders for all non-browsing phases. Gating CTAs behind a second phase transition adds complexity without user-visible benefit. Use animation delays instead.
- **Don't call `initializeGame` directly from the component:** Always dispatch `{ type: "REPLAY" }` and let the reducer call `initializeGame()`. This keeps state updates atomic and avoids render consistency issues.

---

## Don't Hand-Roll

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| Confetti burst | Custom canvas particle system | canvas-confetti | Physics, z-index, performance, accessibility (disableForReducedMotion) all handled; 3KB |
| URL encoding for share | Manual `%20` substitution | `encodeURIComponent()` | Handles all Unicode correctly including the → arrow character |
| Animation sequencing | `setTimeout` chains for multi-step reveal | Framer Motion `delay` props (already in use) | Cancellable on unmount, declarative, already working |
| Random deck shuffling | Custom Fisher-Yates in the component | `initializeGame()` in gameReducer | Already implemented and tested pattern |

**Key insight:** The reveal infrastructure is already built. This phase is about adding three missing pieces (confetti, Share button, Replay button) on top of a working foundation — not re-architecting.

---

## Common Pitfalls

### Pitfall 1: Confetti Fires on Every Re-Render

**What goes wrong:** The useEffect dependency array includes the entire `state` object. Every state update (including from the auto-dismiss timer) re-fires the confetti.

**Why it happens:** `state.phase` is accessed through `state` — if the dependency is `state` rather than `state.phase`, the effect runs too broadly.

**How to avoid:** Use `state.phase` as the specific dependency:
```typescript
useEffect(() => {
  if (state.phase !== "reveal") return;
  // ...
}, [state.phase]); // NOT [state]
```

**Warning signs:** Confetti bursting during browsing phase, or multiple confetti bursts on reveal.

### Pitfall 2: REPLAY Action Returns Stale State

**What goes wrong:** REPLAY case in reducer does `return { ...state, phase: "browsing", dismissed: new Set() }` — this reuses the existing `cards` array from the previous game instead of generating a new shuffled deck.

**Why it happens:** Partial reset pattern looks correct but misses re-shuffling.

**How to avoid:** Call `initializeGame()` in the REPLAY case to get a completely fresh state:
```typescript
case "REPLAY":
  return initializeGame();
```

**Warning signs:** Same 6 celebrities appearing in same order on every replay.

### Pitfall 3: Share URL Arrow Character Not Encoded

**What goes wrong:** The share text "Find out → twittercelebrity.com" uses the Unicode arrow `→` (U+2192). If concatenated directly into the URL without encoding, it breaks the Web Intent URL.

**Why it happens:** Copy-pasting the arrow character into a template string without wrapping in `encodeURIComponent`.

**How to avoid:** Always use `encodeURIComponent(shareText)` — never manually construct the percent-encoding. The encoded form of `→` is `%E2%86%92`.

**Warning signs:** Share button opens X with truncated or malformed text.

### Pitfall 4: canvas-confetti Not Found (TypeScript Import Error)

**What goes wrong:** `import confetti from "canvas-confetti"` throws a TypeScript error because `@types/canvas-confetti` is not installed.

**Why it happens:** canvas-confetti ships without bundled TypeScript types. The types are a separate `@types/` package.

**How to avoid:** Install both packages:
```bash
npm install canvas-confetti
npm install -D @types/canvas-confetti
```

**Warning signs:** `Could not find a declaration file for module 'canvas-confetti'` TypeScript error at build time.

### Pitfall 5: Auto-Dismiss Timer Continues After Reveal

**What goes wrong:** The auto-dismiss useEffect in home.tsx has `if (state.phase !== "browsing") return` guard — this is correct and already handles the stop condition. But if REPLAY resets phase to "browsing", the auto-dismiss timer must restart cleanly.

**Why it happens:** The useEffect cleanup `clearInterval` fires on re-render but the effect is re-registered because `state.phase` returns to "browsing". This is the correct behavior — nothing to fix here, but worth verifying after REPLAY is wired up.

**Warning signs:** No auto-dismiss happening after replay, or double-speed dismiss after replay.

---

## Code Examples

Verified patterns from existing code and official sources:

### canvas-confetti — Cyberpunk Burst
```typescript
// Source: canvas-confetti GitHub README + official API docs
import confetti from "canvas-confetti";

confetti({
  particleCount: 150,
  spread: 80,
  startVelocity: 55,
  origin: { x: 0.5, y: 0.4 },
  colors: ["#00f5ff", "#ff006e", "#ffd700"], // neon-cyan, neon-pink, neon-yellow
  disableForReducedMotion: true,
});
```

The `origin` values are 0-1 fractions of the viewport. `y: 0.4` fires from roughly the vertical center, appropriate for a full-page hero reveal.

### X Web Intent URL — Full Example
```typescript
// Source: developer.x.com/en/docs/x-for-websites
const SHARE_TEXT = "Think you know who the real Twitter Celebrity is? Find out → twittercelebrity.com";

<a
  href={`https://x.com/intent/tweet?text=${encodeURIComponent(SHARE_TEXT)}`}
  target="_blank"
  rel="noopener noreferrer"
>
  Share on X
</a>
```

### gameReducer REPLAY Case
```typescript
// app/state/gameReducer.ts
// Source: existing codebase — initializeGame() already defined in same file
case "REPLAY":
  return initializeGame();
```

### Existing Hero Card Animation (for timing reference)
```typescript
// Source: app/routes/home.tsx lines 92-118 (read directly)
// Hero card arrives at: delay 1.2s + duration 0.7s = fully landed at ~1.9s
// Follow CTA appears at: delay 2.0s
// New Share/Replay CTAs should appear at: delay 2.3s
<motion.div
  initial={{ opacity: 0, scale: 0.6, y: 40 }}
  animate={{
    opacity: 1,
    scale: 1,
    y: 0,
    transition: {
      delay: 1.2,
      duration: 0.7,
      ease: [0.34, 1.56, 0.64, 1], // spring-like overshoot
    },
  }}
>
```

---

## State of the Art

| Old Approach | Current Approach | Notes |
|--------------|------------------|-------|
| CSS `animation-delay` chains for sequenced reveal | Framer Motion `delay` props on individual motion.div elements | Already in use in this project |
| `window.open()` for share links | `<a target="_blank">` with Web Intent URL | More reliable on mobile, no popup blocker issues |
| Full state object in useEffect deps | Specific property (`state.phase`) in deps | Avoids over-firing effects |

**Deprecated/outdated in this codebase:**
- `TRIGGER_REVEAL` action: declared in GameAction union but never dispatched — phase transitions to "reveal" happen automatically inside DISMISS_CARD case when nonChadRemaining.length === 0. Not needed, can be left as dead code.

---

## Open Questions

1. **Should "post" phase be used or ignored?**
   - What we know: `GamePhase` includes "post" in the type, but home.tsx uses `state.phase === "browsing"` as the only branch condition — everything non-browsing renders the reveal section.
   - What's unclear: CONTEXT.md references a three-act sequence but doesn't require a separate "post" phase state. The architecture docs mention "post" as a distinct phase but the current implementation doesn't gate on it.
   - Recommendation: Keep the current single branch (`browsing` vs everything else). CTA buttons appear via animation delay, not phase transition. The "post" phase type can remain for future use. This avoids adding a phase transition mechanism (needing to dispatch ADVANCE_TO_POST after reveal animation completes) for no user-visible benefit.

2. **Cannon blast vs. double-cannon (two origin points)?**
   - What we know: canvas-confetti supports calling `confetti()` multiple times simultaneously for multi-directional bursts (left + right cannon effect).
   - What's unclear: How dramatic the user wants the burst. Single centered burst is simpler; double-cannon from lower-left and lower-right is more cinematic.
   - Recommendation: Claude's discretion per CONTEXT.md. Start with a single centered burst (`origin: {x:0.5, y:0.4}`), but a two-call double-cannon is low-effort enhancement if it looks flat.

---

## Validation Architecture

### Test Framework
| Property | Value |
|----------|-------|
| Framework | Vitest ^4.1.0 |
| Config file | `/Users/chad.cluff/personal/twittercelebrity/vitest.config.ts` |
| Quick run command | `npm test` |
| Full suite command | `npm test` |

### Phase Requirements → Test Map

| Req ID | Behavior | Test Type | Automated Command | File Exists? |
|--------|----------|-----------|-------------------|-------------|
| REVL-01 | gameReducer transitions phase to "reveal" when all non-chad cards dismissed | unit | `npm test -- --reporter=verbose` | ✅ Wave 0 |
| REVL-02 | Exit animation plays (AnimatePresence) | manual | Visual inspection in browser | N/A — animation |
| REVL-03 | Pause between exit and entrance | manual | Visual inspection in browser | N/A — timing |
| REVL-04 | Hero card scales in with spring animation | manual | Visual inspection in browser | N/A — animation |
| REVL-05 | Confetti fires on reveal | manual | Visual inspection in browser | N/A — canvas side-effect |
| REVL-06 | Neon glow visible on hero card | manual | Visual inspection in browser | N/A — visual |
| POST-01 | Follow link href = "https://x.com/chadcluff" | unit | `npm test` | ❌ Wave 0 |
| POST-02 | Share URL contains correct encoded tweet text | unit | `npm test` | ❌ Wave 0 |
| POST-03 | REPLAY action resets to "browsing" with new shuffled cards | unit | `npm test` | ❌ Wave 0 |
| POST-04 | Bio/tagline text visible in reveal section | manual | Visual inspection | N/A — copy |

### Sampling Rate
- **Per task commit:** `npm test`
- **Per wave merge:** `npm test`
- **Phase gate:** Full suite green before `/gsd:verify-work`

### Wave 0 Gaps
- [ ] `tests/gameReducer.test.ts` — covers REVL-01 (phase transition to "reveal"), POST-03 (REPLAY action resets state with fresh cards)
- [ ] `tests/reveal.test.ts` — covers POST-01 (Follow link href), POST-02 (Share URL encoding)

*(Existing `tests/celebrity-data.test.ts` already covers celebrity data integrity — no changes needed there.)*

---

## Sources

### Primary (HIGH confidence)
- `app/routes/home.tsx` — Direct read of existing reveal implementation (lines 65-135)
- `app/state/gameReducer.ts` — Direct read of state machine, confirmed REPLAY declared but unimplemented
- `app/data/chadcluff.ts` — Direct read of hero card data
- `.planning/research/STACK.md` — canvas-confetti 1.9.4 confirmed as locked choice
- `.planning/research/ARCHITECTURE.md` — Phase-driven state machine, useAnimation patterns
- `.planning/research/FEATURES.md` — X Web Intent URL pattern, reveal sequence design
- canvas-confetti GitHub README (WebFetch) — API options: particleCount, spread, origin, colors, disableForReducedMotion
- developer.x.com/en/docs/x-for-websites — X Web Intent URL format (no auth required)

### Secondary (MEDIUM confidence)
- WebSearch: canvas-confetti TypeScript import pattern with @types/canvas-confetti (verified against npm package existence)

### Tertiary (LOW confidence)
- None

---

## Metadata

**Confidence breakdown:**
- Standard stack: HIGH — all libraries confirmed installed or documented in prior research
- Architecture: HIGH — directly reading existing implementation code
- Pitfalls: HIGH — derived from direct code analysis and API documentation
- Confetti timing values: MEDIUM — recommended values are reasonable defaults, may need tuning during implementation

**Research date:** 2026-03-15
**Valid until:** 2026-04-15 (stable stack — no fast-moving pieces)
