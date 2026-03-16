# Phase 2: Card Game Mechanics - Research

**Researched:** 2026-03-15
**Domain:** Framer Motion drag gestures, AnimatePresence, CSS grid layout, React useReducer state machine
**Confidence:** HIGH — all critical claims verified against existing project research files and official documentation

---

<user_constraints>
## User Constraints (from CONTEXT.md)

### Locked Decisions

**Card layout:**
- Responsive CSS grid: 4 columns on desktop, 2 columns on mobile
- Medium card size: shows profile photo, @handle, display name, bio snippet — may scroll on mobile
- When a card is dismissed, remaining cards reflow with smooth animation to fill gaps
- Sticky header: "Twitter Celebrity" title stays pinned at top while cards scroll below
- Subtle instruction hint (e.g., "Tap X to eliminate") that fades after first dismiss

**Card visual design:**
- Must use existing neon tokens from `app/styles/app.css` (cyber-black, neon-cyan, neon-pink, neon-yellow)
- Cards show: photo, @handle, display name, bio snippet, follower count (per CARD-02)

**Dismiss mechanics:**
- X button in card corner for tap dismiss (all devices)
- Swipe-to-dismiss gesture on touch devices
- Cards tilt during swipe drag for tactile feedback (Framer Motion `drag` prop)

**Game state:**
- Cards randomized on every page load (decided in Phase 1)
- @chadcluff card cannot be dismissed — always the last remaining card
- Track dismiss count for reveal trigger (Phase 3 will use this)
- When all 14 non-chadcluff cards are dismissed, game state transitions to "reveal" — reveal animation itself is Phase 3

**Staggered entry animation:**
- Cards animate in with stagger on page load (not all appearing simultaneously)

### Claude's Discretion
- Exact card border, shadow, and glow styling
- Swipe threshold distance, dismiss velocity, and exit animation direction
- Staggered entry timing and easing
- Instruction hint text, position, and fade timing
- Grid gap spacing and card aspect ratio
- How the X button looks (icon, position, hover state)

### Deferred Ideas (OUT OF SCOPE)
None — discussion stayed within phase scope
</user_constraints>

---

<phase_requirements>
## Phase Requirements

| ID | Description | Research Support |
|----|-------------|-----------------|
| CARD-01 | User sees a grid of ~15-20 celebrity cards on page load | CSS grid 2/3/4 cols pattern + AnimatePresence wrapper; all 15 cards (14 + chadcluff) are in existing data files |
| CARD-02 | Each card displays profile photo, @handle, display name, bio snippet, and follower count | `CelebrityCard` interface already has all fields; card layout defined in UI-SPEC |
| CARD-03 | User can dismiss a card by tapping the X button in the corner | `<DismissButton>` component with onClick calling shared dismiss handler; button omitted for isChad card |
| CARD-04 | User can dismiss a card by swiping it away on touch devices | Framer Motion `drag="x"` + `onDragEnd` threshold check; `touch-action: none` prevents scroll conflict |
| CARD-05 | Cards tilt during swipe drag for tactile feedback | `useMotionValue` + `useTransform` for rotate tied to drag x position; UI-SPEC specifies ±15deg at threshold |
| CARD-06 | Cards animate in with staggered entry on page load | Framer Motion `initial`/`animate` variants with `delay: index * 0.06` per card |
| DESG-04 | Responsive layout works on mobile and desktop | Grid breakpoints: `grid-cols-2` → `grid-cols-3` → `grid-cols-4`; card content scales within fixed aspect ratios |
</phase_requirements>

---

## Summary

Phase 2 transforms the placeholder `home.tsx` into a fully playable card-dismissal game. The foundation (data, types, styles, routing) from Phase 1 is complete — this phase adds the interactive layer on top. The entire game lives in a single route (`app/routes/home.tsx`) with conditional scene rendering driven by a `useReducer` state machine.

The two core technical challenges are: (1) implementing Framer Motion drag-to-dismiss with correct `touch-action` handling to avoid scroll conflict on mobile, and (2) orchestrating AnimatePresence so exit animations actually play before cards unmount (the most common failure mode in this pattern). Both are well-understood problems with verified solutions in the existing project research.

Framer Motion is not yet in `package.json` — it must be installed in Wave 0 before any component work. The entire animation and gesture system for this phase is Framer Motion only; no additional gesture libraries are needed.

**Primary recommendation:** Install Framer Motion 12.x, build the `useReducer` state machine first (all components depend on it), then wire up components in dependency order: state → CardGrid → CelebrityCard → DismissButton → StickyHeader → InstructionHint.

---

## Standard Stack

### Core (already installed — no new installs except Framer Motion)

| Library | Version | Purpose | Why Standard |
|---------|---------|---------|--------------|
| React | 19.2.4 | UI rendering | Already installed; React 19 concurrent features work well with Framer Motion layout animations |
| React Router 7 | 7.12.0 | SPA framework | Already installed; single route `app/routes/home.tsx` is the only route needed |
| Tailwind CSS | 4.1.13 | Utility styling | Already installed with `@tailwindcss/vite`; all cyberpunk tokens declared in `app/styles/app.css` |
| TypeScript | 5.9.2 | Type safety | Already installed; `CelebrityCard` interface in `app/state/types.ts` is the shared contract |
| Vitest | 4.1.0 | Testing | Already installed |

### New Dependency Required

| Library | Version | Purpose | Why Standard |
|---------|---------|---------|--------------|
| framer-motion | 12.x (latest) | Drag gestures, card animations, AnimatePresence, layout reflow | Mandated by project decisions. Handles drag + tilt + exit animations in one library. No separate gesture lib needed. |

**Installation:**
```bash
npm install framer-motion
```

### Alternatives Considered

| Instead of | Could Use | Tradeoff |
|------------|-----------|----------|
| framer-motion drag | react-swipeable | react-swipeable only handles gesture detection, not animations — requires separate animation layer |
| framer-motion layout | Manual CSS transitions for reflow | CSS-only reflow requires calculating grid positions manually; Framer Motion `layout` prop handles this automatically |

---

## Architecture Patterns

### State Machine (useReducer)

The game state is a finite state machine. Phase 2 covers the `browsing` phase and the transition to `reveal`. Phase 3 owns the `reveal` and `post` phases.

**State shape:**
```typescript
// app/state/gameReducer.ts
type GamePhase = 'browsing' | 'reveal' | 'post';

interface GameState {
  phase: GamePhase;
  cards: CelebrityCard[];      // full deck, randomized on init
  dismissed: Set<string>;       // card IDs that have been dismissed
}

type GameAction =
  | { type: 'DISMISS_CARD'; id: string }
  | { type: 'TRIGGER_REVEAL' }   // Phase 3 owns this
  | { type: 'REPLAY' };          // Phase 3 owns this

function gameReducer(state: GameState, action: GameAction): GameState {
  switch (action.type) {
    case 'DISMISS_CARD': {
      const dismissed = new Set(state.dismissed).add(action.id);
      const nonChadRemaining = state.cards.filter(
        c => !dismissed.has(c.id) && !c.isChad
      );
      const phase = nonChadRemaining.length === 0 ? 'reveal' : 'browsing';
      return { ...state, dismissed, phase };
    }
    default:
      return state;
  }
}
```

**Initial state (randomized):**
```typescript
// Fisher-Yates shuffle — call once on component mount, not on every render
function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

// useMemo ensures randomization happens once on mount, not on re-renders
const initialCards = useMemo(() => [...shuffle(CELEBRITIES), CHADCLUFF], []);
```

### Recommended Project Structure

```
app/
├── routes/
│   └── home.tsx              # Root of the game — hosts useReducer + GameContext
├── components/
│   ├── CardGrid.tsx          # AnimatePresence wrapper + grid layout
│   ├── CelebrityCard.tsx     # motion.div with drag, tilt, exit animation
│   ├── DismissButton.tsx     # Absolute-positioned X button (44x44 touch target)
│   ├── StickyHeader.tsx      # "Twitter Celebrity" sticky header
│   └── InstructionHint.tsx   # Fade-in/out hint text
├── state/
│   ├── types.ts              # CelebrityCard (already exists)
│   └── gameReducer.ts        # useReducer reducer + action types (NEW)
├── data/
│   ├── celebrities.ts        # 14 celebrity entries (already exists)
│   └── chadcluff.ts          # @chadcluff entry (already exists)
└── styles/
    └── app.css               # All tokens already declared (already exists)
```

### Pattern 1: AnimatePresence for Card Dismiss

Wrap the card list in `AnimatePresence`. Cards with a stable `key` prop will run their `exit` animation before unmounting. Cards must remain in the rendered list until their exit animation completes — this is handled automatically by AnimatePresence.

```typescript
// app/components/CardGrid.tsx
import { AnimatePresence, motion } from 'framer-motion';

const visibleCards = cards.filter(c => !dismissed.has(c.id));

return (
  <AnimatePresence>
    {visibleCards.map(card => (
      <CelebrityCard
        key={card.id}              // CRITICAL: stable ID, never array index
        card={card}
        onDismiss={() => dispatch({ type: 'DISMISS_CARD', id: card.id })}
      />
    ))}
  </AnimatePresence>
);
```

**CRITICAL:** `AnimatePresence` must NEVER be conditionally rendered. Its children unmount; it stays.

### Pattern 2: Drag + Tilt + Exit Animation on CelebrityCard

The card uses `useMotionValue` for the drag position, `useTransform` to derive rotation, and `drag="x"` for the swipe gesture. On `onDragEnd`, check offset and velocity to decide whether to dismiss or snap back.

```typescript
// app/components/CelebrityCard.tsx
import { motion, useMotionValue, useTransform } from 'framer-motion';

const x = useMotionValue(0);
const rotate = useTransform(x, [-200, 0, 200], [-15, 0, 15]);

function handleDragEnd(_: PointerEvent, info: PanInfo) {
  const shouldDismiss =
    Math.abs(info.offset.x) > 120 || Math.abs(info.velocity.x) > 500;
  if (shouldDismiss) {
    onDismiss();
  }
}

return (
  <motion.div
    style={{ x, rotate }}
    drag="x"
    dragElastic={0.15}
    dragConstraints={{ left: 0, right: 0 }}
    onDragEnd={handleDragEnd}
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0, transition: { delay: index * 0.06, duration: 0.3, ease: 'easeOut' } }}
    exit={{ x: 600, opacity: 0, rotate: 30, transition: { duration: 0.25, ease: 'easeIn' } }}
    layout                       // enables smooth grid reflow after dismissal
    // CRITICAL: prevents scroll hijacking on mobile
    style={{ x, rotate, touchAction: 'none' }}
  >
    {/* card content */}
  </motion.div>
);
```

**Note on `layout` + `exit`:** These can conflict in some Framer Motion versions. Test explicitly — if cards don't animate out when `layout` is present, separate the layout wrapper from the exiting element.

### Pattern 3: Grid Reflow with layout prop

When a card is dismissed and removed from the DOM, remaining cards need to reflow smoothly into the gaps. Adding `layout` to each `motion.div` and wrapping in `AnimatePresence` achieves this — Framer Motion measures positions before and after, then animates the delta.

```typescript
// Reflow spring configuration on the layout transition
<motion.div
  layout
  layoutTransition={{ type: 'spring', stiffness: 300, damping: 35 }}
>
```

### Pattern 4: @chadcluff Card Treatment

The `isChad` flag on the card data gates both dismissibility and visual treatment:

```typescript
// No DismissButton, no drag, neon-yellow border instead of neon-cyan
<motion.div
  drag={card.isChad ? false : 'x'}
  className={card.isChad
    ? 'border border-neon-yellow'
    : 'border border-neon-cyan/40 hover:border-neon-cyan'}
>
  {!card.isChad && <DismissButton onDismiss={onDismiss} />}
</motion.div>
```

### Pattern 5: InstructionHint Lifecycle

The hint fades in on mount, then fades out after first dismiss OR after 4 seconds, whichever comes first. Implement with a `useState` boolean and `useEffect`:

```typescript
const [visible, setVisible] = useState(true);

// Fade out after 4 seconds
useEffect(() => {
  const timer = setTimeout(() => setVisible(false), 4000);
  return () => clearTimeout(timer);
}, []);

// Fade out on first dismiss — pass dismissCount from parent
useEffect(() => {
  if (dismissCount > 0) setVisible(false);
}, [dismissCount]);

return (
  <AnimatePresence>
    {visible && (
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1, transition: { duration: 0.5 } }}
        exit={{ opacity: 0, transition: { duration: 0.8 } }}
      >
        Tap × to eliminate
      </motion.p>
    )}
  </AnimatePresence>
);
```

### Anti-Patterns to Avoid

- **Array index as key:** `key={index}` breaks AnimatePresence exit animations. Always use `key={card.id}`.
- **Conditional AnimatePresence:** Never put AnimatePresence inside a ternary or conditional block. It must always remain mounted.
- **Dispatch before animation completes:** If you call `onDismiss()` and the state removes the card immediately, AnimatePresence cannot play the exit animation. With Framer Motion `drag`, calling `onDismiss` from `onDragEnd` is correct — AnimatePresence plays the `exit` variant while the card is still in `visibleCards`.
- **Animating width/height for reflow:** Use Framer Motion `layout` prop, not CSS transitions on `width`/`height`. The latter triggers layout/paint on every frame and is janky on mobile.
- **No touch-action on drag elements:** Without `touch-action: none` (or inline `style={{ touchAction: 'none' }}`), horizontal drag on mobile triggers vertical page scroll instead of card movement.

---

## Don't Hand-Roll

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| Swipe gesture detection + threshold | Custom touch event listeners with `touchstart`/`touchmove` | Framer Motion `drag` prop | Passive listener conflict, velocity calculation, pointer capture — Framer Motion handles all of this correctly |
| Card exit animation | Manual CSS class + `setTimeout` removal | Framer Motion `AnimatePresence` + `exit` prop | setTimeout races with animation duration; AnimatePresence awaits completion before DOM removal |
| Grid reflow animation | Calculating grid positions and animating manually | Framer Motion `layout` prop | FLIP animation (measure→animate→play) is complex; `layout` does it in one prop |
| Drag tilt calculation | `onMouseMove` + manual sin/cos transform | `useMotionValue` + `useTransform` | Motion values are subscribed directly without React re-renders — zero jank |
| Fisher-Yates shuffle | None — it's 8 lines of code | Write it inline | Standard algorithm, no library needed |

**Key insight:** Framer Motion's `drag` prop eliminates the need for any separate gesture library. The combination of `drag`, `useMotionValue`, `useTransform`, `AnimatePresence`, and `layout` covers every interaction requirement in this phase.

---

## Common Pitfalls

### Pitfall 1: AnimatePresence exit animations silently fail

**What goes wrong:** Cards disappear instantly on dismiss with no animation.

**Why it happens:** Four causes — (1) `key` is array index not stable ID, (2) `AnimatePresence` is conditionally rendered and unmounts, (3) `AnimatePresence` wraps a component that doesn't forward motion props, (4) `layout` + `exit` on the same element conflict.

**How to avoid:** Always `key={card.id}`. Keep `AnimatePresence` unconditionally rendered. Test dismiss animation immediately after wiring up state — don't leave this until the end.

**Warning signs:** Cards vanish with no transition. Console warnings about key props.

### Pitfall 2: Swipe conflicts with scroll on mobile

**What goes wrong:** Horizontal swipe triggers page scroll instead of card drag. Or console error: "Unable to preventDefault inside passive event listener."

**Why it happens:** Chrome 56+ makes `touchstart`/`touchmove` passive by default. Browsers start scrolling before JS can prevent it.

**How to avoid:** Set `touch-action: none` as an inline style on the draggable `motion.div` (not just in CSS — Framer Motion sets the element's style attribute directly). Framer Motion's `drag` prop handles passive listener negotiation, but only when `touch-action` is configured correctly.

```typescript
// Correct: inline style, not className
<motion.div style={{ touchAction: 'none' }} drag="x" ...>
```

**Warning signs:** Swipe works in Chrome DevTools simulator but not on real iOS device. Real devices are required for testing — DevTools does not accurately simulate passive listeners.

### Pitfall 3: layout + exit animation conflict

**What goes wrong:** Cards either don't reflow OR don't animate out — one cancels the other.

**Why it happens:** Framer Motion versions have had bugs where `layout` animations and `exit` animations running simultaneously cause the exit to be skipped.

**How to avoid:** Test this combination explicitly. One working pattern is to wrap the card in a separate `motion.div` for `layout` and let the inner `motion.div` handle `exit`:

```typescript
// layout on outer wrapper, exit on inner card
<motion.div key={card.id} layout>
  <motion.div exit={{ x: 600, opacity: 0 }} ...>
    {/* card content */}
  </motion.div>
</motion.div>
```

**Warning signs:** Reflow works but exit animation skips, or vice versa.

### Pitfall 4: Re-rendering entire card list on each dismiss

**What goes wrong:** Performance degrades noticeably as cards are dismissed — each dismiss causes all remaining cards to re-render.

**Why it happens:** If the `dispatch` function or card data is not memoized, React treats every card as stale on each state update.

**How to avoid:** Wrap `CelebrityCard` in `React.memo`. Pass `onDismiss` as a stable callback via `useCallback`:

```typescript
const handleDismiss = useCallback((id: string) => {
  dispatch({ type: 'DISMISS_CARD', id });
}, [dispatch]);
```

### Pitfall 5: Randomization re-runs on every render

**What goes wrong:** Card order changes on every state update during dismiss — cards visually jump to new positions mid-game.

**Why it happens:** The shuffle function is called inside the component body without memoization.

**How to avoid:** Initialize the shuffled deck with `useMemo` with an empty dependency array `[]`:

```typescript
const initialCards = useMemo(() => [...shuffle(CELEBRITIES), CHADCLUFF], []);
const [state, dispatch] = useReducer(gameReducer, {
  phase: 'browsing',
  cards: initialCards,
  dismissed: new Set<string>(),
});
```

---

## Code Examples

Verified patterns from official sources and project research files:

### Framer Motion drag with tilt
```typescript
// Source: .planning/research/STACK.md + motion.dev/docs/react-drag
const x = useMotionValue(0);
const rotate = useTransform(x, [-200, 0, 200], [-15, 0, 15]);

<motion.div
  style={{ x, rotate, touchAction: 'none' }}
  drag="x"
  dragElastic={0.15}
  dragConstraints={{ left: 0, right: 0 }}
  onDragEnd={(_, info) => {
    if (Math.abs(info.offset.x) > 120 || Math.abs(info.velocity.x) > 500) {
      onDismiss();
    }
  }}
/>
```

### AnimatePresence with stable keys
```typescript
// Source: .planning/research/ARCHITECTURE.md
<AnimatePresence>
  {visibleCards.map(card => (
    <CelebrityCard
      key={card.id}
      card={card}
      onDismiss={() => dispatch({ type: 'DISMISS_CARD', id: card.id })}
    />
  ))}
</AnimatePresence>
```

### Staggered entry animation
```typescript
// Source: .planning/research/FEATURES.md + UI-SPEC.md
// index * 60ms delay, 300ms duration, easeOut, y: 20 → 0
<motion.div
  initial={{ opacity: 0, y: 20 }}
  animate={{
    opacity: 1,
    y: 0,
    transition: { delay: index * 0.06, duration: 0.3, ease: 'easeOut' }
  }}
  exit={{ x: 600, opacity: 0, rotate: 30, transition: { duration: 0.25, ease: 'easeIn' } }}
/>
```

### Grid reflow spring
```typescript
// Source: .planning/research/ARCHITECTURE.md + UI-SPEC.md
// stiffness: 300, damping: 35 per UI-SPEC
<motion.div layout layoutTransition={{ type: 'spring', stiffness: 300, damping: 35 }} />
```

### Snap-back spring (below threshold)
```typescript
// Source: UI-SPEC.md — stiffness: 400, damping: 40
// When drag ends below threshold, card snaps back via dragConstraints
// dragConstraints: { left: 0, right: 0 } + dragElastic: 0.15
// Spring configured on the drag constraints bounce:
<motion.div
  drag="x"
  dragConstraints={{ left: 0, right: 0 }}
  dragElastic={0.15}
  dragTransition={{ bounceStiffness: 400, bounceDamping: 40 }}
/>
```

### CSS grid responsive breakpoints
```typescript
// Source: UI-SPEC.md responsive breakpoints
// Tailwind v4: grid-cols-2 (mobile) → md:grid-cols-3 (768px) → xl:grid-cols-4 (1280px)
<div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4 xl:gap-6 p-4 xl:p-8">
```

### Image error fallback (initials placeholder)
```typescript
// Source: UI-SPEC.md copywriting contract
// Shows initials in cyber-muted on gray background
<img
  src={card.photoPath}
  alt={card.displayName}
  className="w-full object-cover"
  onError={(e) => {
    const target = e.currentTarget;
    target.style.display = 'none';
    // Show initials via sibling element
  }}
/>
```

---

## State of the Art

| Old Approach | Current Approach | When Changed | Impact |
|--------------|------------------|--------------|--------|
| `framer-motion` (legacy package name) | `framer-motion` still valid but `motion` is the new canonical name for the lib | FM v11+ | Same npm package `framer-motion` — import from `'framer-motion'` still works |
| `motion.div` with `layoutId` for shared element transitions | Same pattern still used | N/A | Not needed in Phase 2 but relevant for Phase 3 hero expansion |
| Separate gesture library (`react-use-gesture`) | Framer Motion `drag` prop replaces it for this use case | FM v8+ | No separate gesture lib needed |
| Tailwind v3 JS config (`tailwind.config.js`) | Tailwind v4 CSS-first (`@theme` in CSS file) | v4.0 | Project already using v4; all tokens in `app/styles/app.css` |

**Not deprecated, still current:**
- `AnimatePresence` — core API, unchanged
- `useMotionValue` + `useTransform` — core API, unchanged
- `drag` prop — core API, unchanged

---

## Open Questions

1. **`layout` + `exit` coexistence on same element**
   - What we know: there is a documented Framer Motion bug where concurrent `layout` and `exit` animations can conflict, causing one to be skipped
   - What's unclear: whether this is fixed in FM 12.x (the version we'll install)
   - Recommendation: implement the nested wrapper pattern (outer `motion.div` with `layout`, inner `motion.div` with `exit`) as the default approach to avoid the issue entirely

2. **Grid `aspect-ratio` support in Tailwind v4**
   - What we know: UI-SPEC specifies 3:4 portrait on mobile, 2:3 on desktop; Tailwind v4 supports `aspect-ratio` utilities
   - What's unclear: exact utility class names in Tailwind v4 for custom aspect ratios
   - Recommendation: use `aspect-[3/4]` and `md:aspect-[2/3]` (Tailwind arbitrary value syntax) or declare custom aspect ratio tokens in `@theme`

3. **`dragTransition` for snap-back spring**
   - What we know: `dragConstraints` with `dragElastic` controls snap-back behavior; `dragTransition` further configures it
   - What's unclear: exact `dragTransition` prop shape in FM 12.x — `bounceStiffness`/`bounceDamping` vs `type: 'spring'`
   - Recommendation: test both; fall back to `dragConstraints={{ left: 0, right: 0 }}` + `dragElastic={0.15}` as default if `dragTransition` API has changed

---

## Validation Architecture

### Test Framework

| Property | Value |
|----------|-------|
| Framework | Vitest 4.1.0 |
| Config file | none found — likely inferred by Vitest from `vite.config.ts` or `package.json` |
| Quick run command | `npm test` (runs `vitest run --reporter=verbose`) |
| Full suite command | `npm test` |

### Phase Requirements → Test Map

| Req ID | Behavior | Test Type | Automated Command | File Exists? |
|--------|----------|-----------|-------------------|-------------|
| CARD-01 | Grid renders all 15 cards on load | unit | `npm test -- --reporter=verbose` | ❌ Wave 0 |
| CARD-02 | Each card displays photo, handle, name, bio, follower count | unit | `npm test` | ❌ Wave 0 |
| CARD-03 | X button click dispatches DISMISS_CARD, card removed from DOM after animation | unit | `npm test` | ❌ Wave 0 |
| CARD-04 | Swipe beyond threshold calls onDismiss; below threshold does not | unit | `npm test` | ❌ Wave 0 |
| CARD-05 | Rotate value increases proportional to drag delta | unit | `npm test` | ❌ Wave 0 |
| CARD-06 | Cards appear with staggered delay on mount | unit | `npm test` | ❌ Wave 0 |
| DESG-04 | Grid renders 2/3/4 columns at 375/768/1280px | manual-only | Visual inspection at breakpoints | N/A |

**Note on DESG-04:** Responsive layout testing requires browser viewport testing. CSS grid column count cannot be reliably verified with jsdom (Vitest's default DOM environment). Manual testing at each breakpoint is the correct approach.

**Note on animation testing:** Framer Motion animations require mocking in unit tests. Use `vi.mock('framer-motion', ...)` to simplify animation testing, or use `@testing-library/user-event` for interaction testing with animations disabled.

### Sampling Rate

- **Per task commit:** `npm test`
- **Per wave merge:** `npm test`
- **Phase gate:** Full suite green before `/gsd:verify-work`

### Wave 0 Gaps

- [ ] `app/components/__tests__/CardGrid.test.tsx` — covers CARD-01 (grid renders all cards)
- [ ] `app/components/__tests__/CelebrityCard.test.tsx` — covers CARD-02, CARD-03, CARD-04, CARD-05
- [ ] `app/components/__tests__/CardGrid.entry.test.tsx` — covers CARD-06 (stagger entry)
- [ ] `app/state/__tests__/gameReducer.test.ts` — unit tests for reducer: DISMISS_CARD action, phase transition to 'reveal', isChad guard
- [ ] Framer Motion mock: `app/__tests__/setup/framer-motion.mock.ts` — shared mock for all tests

---

## Sources

### Primary (HIGH confidence)
- `.planning/research/STACK.md` — Framer Motion 12.x drag API, canvas-confetti, Tailwind v4 setup (researched 2026-03-15)
- `.planning/research/ARCHITECTURE.md` — useReducer state machine, AnimatePresence pattern, component structure (researched 2026-03-15)
- `.planning/research/PITFALLS.md` — AnimatePresence key/exit pitfalls, touch-action conflict, performance traps (researched 2026-03-15)
- `.planning/research/FEATURES.md` — Feature dependencies, Tinder swipe pattern, dismiss handler sharing (researched 2026-03-15)
- `app/state/types.ts` — existing `CelebrityCard` interface (confirmed in project)
- `app/styles/app.css` — all color tokens confirmed present (cyber-black, neon-cyan, neon-pink, neon-yellow, cyber-panel, cyber-surface, cyber-text, cyber-muted)
- `app/data/celebrities.ts` — 14 celebrity entries confirmed, all `isChad: false`
- `app/data/chadcluff.ts` — @chadcluff entry confirmed, `isChad: true`
- `package.json` — confirmed `framer-motion` is NOT installed; must be Wave 0 dependency

### Secondary (MEDIUM confidence)
- `02-UI-SPEC.md` — pixel-level specs for all component dimensions, spacing, animation timing (verified against CONTEXT.md locked decisions)
- `02-CONTEXT.md` — locked decisions and discretion areas (source of truth for scope)

### Tertiary (LOW confidence)
- Framer Motion `layout` + `exit` conflict — flagged from project PITFALLS.md; specific fix in FM 12.x not independently verified

---

## Metadata

**Confidence breakdown:**
- Standard stack: HIGH — all versions confirmed in package.json; framer-motion install is the only new step
- Architecture: HIGH — state machine pattern directly from project ARCHITECTURE.md; component structure is well-specified
- Animation patterns: HIGH — drag, AnimatePresence, layout patterns from official Framer Motion docs (via project STACK.md)
- Pitfalls: HIGH for touch-action and AnimatePresence key issues (well-documented); MEDIUM for layout+exit conflict (FM 12.x behavior not independently tested)
- UI specs: HIGH — UI-SPEC.md provides pixel-level detail for all components

**Research date:** 2026-03-15
**Valid until:** 2026-04-15 (stable libraries; Framer Motion 12.x API is mature)
