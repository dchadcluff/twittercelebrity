# Architecture Research

**Domain:** Interactive animated card-game single-page experience
**Researched:** 2026-03-15
**Confidence:** HIGH

## Standard Architecture

### System Overview

```
┌─────────────────────────────────────────────────────────────────┐
│                      CLOUDFLARE PAGES CDN                        │
│         Static assets (HTML, JS, CSS, images)                    │
│         SPA fallback: all routes → index.html                    │
└─────────────────────┬───────────────────────────────────────────┘
                      │ serves
┌─────────────────────▼───────────────────────────────────────────┐
│                   REACT ROUTER 7 (SPA Mode)                      │
│              ssr: false — single-route SPA (no multi-page)       │
├─────────────────────────────────────────────────────────────────┤
│  ┌───────────────────────────────────────────────────────────┐   │
│  │                  APP STATE (useReducer)                    │   │
│  │                                                           │   │
│  │  phase: 'browsing' | 'dismissing' | 'reveal' | 'post'    │   │
│  │  cards: CelebrityCard[]  (ordered deck)                   │   │
│  │  dismissed: Set<string>  (card IDs)                       │   │
│  │  activeCard: string | null  (currently animating out)     │   │
│  └────────────────────────┬──────────────────────────────────┘   │
│                           │ dispatch / state                      │
├───────────────────────────┼─────────────────────────────────────┤
│                    SCENE LAYER                                    │
│  ┌─────────────┐  ┌───────────────┐  ┌────────────────────────┐  │
│  │  CardDeck   │  │  RevealScene  │  │    PostRevealScene     │  │
│  │  Scene      │  │               │  │                        │  │
│  └──────┬──────┘  └───────┬───────┘  └──────────┬─────────────┘  │
│         │                │                      │                │
├─────────┼────────────────┼──────────────────────┼────────────────┤
│                   COMPONENT LAYER                                 │
│  ┌──────────┐  ┌────────────┐  ┌──────────┐  ┌───────────────┐   │
│  │  Card    │  │ DismissBtn │  │ Confetti │  │  CTA / Share  │   │
│  │          │  │ / Swipe    │  │ Overlay  │  │  Buttons      │   │
│  └──────────┘  └────────────┘  └──────────┘  └───────────────┘   │
├─────────────────────────────────────────────────────────────────┤
│                   ANIMATION LAYER (Framer Motion)                 │
│  AnimatePresence wraps deck — exit animations on card dismiss     │
│  motion.div orchestration — stagger, spotlight, hero expand       │
└─────────────────────────────────────────────────────────────────┘
                      │
┌─────────────────────▼───────────────────────────────────────────┐
│                   STATIC DATA LAYER                               │
│  src/data/celebrities.ts — hardcoded array of CelebrityCard      │
│  src/data/chadcluff.ts   — hero card data                        │
│  public/images/          — celebrity profile photos              │
└─────────────────────────────────────────────────────────────────┘
```

### Component Responsibilities

| Component | Responsibility | Communicates With |
|-----------|----------------|-------------------|
| `App` (root route) | Hosts app state via `useReducer`; renders active scene | All scene components via context/props |
| `CardDeckScene` | Renders the grid/masonry of dismissible cards | `Card`, `AppState` (read phase, dismissed set) |
| `Card` | Displays one celebrity; handles dismiss gesture/button | `AppState` (dispatch dismiss action) |
| `RevealScene` | Dramatic transition: cards fly away, hero card expands | `AppState` (phase === 'reveal'), Framer Motion |
| `PostRevealScene` | Shows CTA, share button, replay; @chadcluff hero treatment | `AppState` (dispatch replay), external X link |
| `AnimationOrchestrator` | Coordinates multi-step reveal sequence (not a real component — Framer Motion `useAnimation` hooks inside RevealScene) | Framer Motion `useAnimation`, `AnimatePresence` |
| `CelebrityCard` (data type) | Typed shape: id, handle, displayName, bio, followerCount, photoUrl | Static data file only |

## Recommended Project Structure

```
src/
├── routes/
│   └── home.tsx              # Single route — the entire experience lives here
├── scenes/
│   ├── CardDeckScene.tsx     # Phase: 'browsing' — the card grid
│   ├── RevealScene.tsx       # Phase: 'reveal' — dramatic animation sequence
│   └── PostRevealScene.tsx   # Phase: 'post' — CTA, share, replay
├── components/
│   ├── Card/
│   │   ├── Card.tsx          # Celebrity card UI + dismiss interaction
│   │   ├── Card.css          # Cyberpunk card styles (neon borders, glitch)
│   │   └── index.ts
│   ├── HeroCard/
│   │   ├── HeroCard.tsx      # @chadcluff enlarged hero treatment
│   │   └── index.ts
│   ├── ConfettiOverlay.tsx   # react-confetti-explosion trigger
│   └── ShareButton.tsx       # Pre-composed tweet URL for X sharing
├── state/
│   ├── appReducer.ts         # useReducer reducer + action types
│   └── types.ts              # AppState, AppAction, Phase, CelebrityCard types
├── data/
│   ├── celebrities.ts        # Hardcoded array of ~15-20 CelebrityCard objects
│   └── chadcluff.ts          # @chadcluff hero card data
├── hooks/
│   ├── useSwipeDismiss.ts    # Touch gesture logic (pointer events / react-use-gesture)
│   └── useRevealSequence.ts  # Framer Motion useAnimation orchestration
├── styles/
│   ├── globals.css           # CSS variables: neon palette, dark background, fonts
│   └── cyberpunk.css         # Shared glitch effects, scanlines, neon glow
├── root.tsx                  # React Router 7 root with HydrateFallback
└── entry.client.tsx          # Client hydration entry point

public/
├── images/
│   └── celebrities/          # Profile photos (downloaded by refresh script)
└── _redirects                # Cloudflare Pages: /* /index.html 200

scripts/
└── refresh-data.ts           # CLI script to fetch and update celebrity data
```

### Structure Rationale

- **scenes/:** Distinct top-level experiences (browsing, reveal, post-reveal) are separate files. State determines which scene renders; scenes do not route — they are conditionally rendered by `App`.
- **components/:** Reusable UI pieces that scenes compose. Card is used in both `CardDeckScene` and `RevealScene`. Keeps scenes thin.
- **state/:** Isolating the reducer and types makes the entire app state auditable in one place. Critical for a sequence-heavy experience.
- **hooks/:** Gesture logic and animation orchestration are complex enough to extract. Keeps components declarative.
- **data/:** Pure data, no logic. Easy to replace with a generated file from the refresh script.

## Architectural Patterns

### Pattern 1: Phase-Driven Scene Switching (State Machine)

**What:** The entire app lifecycle is a finite state machine with four phases: `browsing → dismissing → reveal → post`. Components observe the current phase and render accordingly. No routing between scenes — they are conditional renders.

**When to use:** Any experience that has a strict linear narrative with distinct visual states. Avoids the complexity of React Router routes for what is really a single-page story.

**Trade-offs:** Simple, predictable, easily debuggable. Phases can only advance forward (no back-navigation required, which matches the "reveal" narrative).

**Example:**
```typescript
// state/appReducer.ts
type Phase = 'browsing' | 'reveal' | 'post';

interface AppState {
  phase: Phase;
  dismissed: Set<string>;
  cards: CelebrityCard[];
}

type AppAction =
  | { type: 'DISMISS_CARD'; id: string }
  | { type: 'TRIGGER_REVEAL' }
  | { type: 'REPLAY' };

function appReducer(state: AppState, action: AppAction): AppState {
  switch (action.type) {
    case 'DISMISS_CARD': {
      const dismissed = new Set(state.dismissed).add(action.id);
      const remaining = state.cards.filter(c => !dismissed.has(c.id) && c.id !== 'chadcluff');
      const phase = remaining.length === 0 ? 'reveal' : 'browsing';
      return { ...state, dismissed, phase };
    }
    case 'REPLAY':
      return { ...state, phase: 'browsing', dismissed: new Set() };
    default:
      return state;
  }
}
```

### Pattern 2: AnimatePresence for Card Exit Animations

**What:** Wrap the card list in Framer Motion's `AnimatePresence`. When a card is removed from the rendered list (after dismiss is dispatched), `AnimatePresence` lets it run its `exit` animation before unmounting. The card's state is removed from `dismissed` only after the animation completes.

**When to use:** Any list where items are added/removed and you want exit animations to play. Essential here — without it, cards disappear instantly.

**Trade-offs:** Cards must have stable `key` props. State update (marking dismissed) must be delayed until exit animation completes, or the card unmounts before animating. Use Framer Motion's `onAnimationComplete` callback.

**Example:**
```typescript
// scenes/CardDeckScene.tsx
import { AnimatePresence } from 'framer-motion';

const visibleCards = cards.filter(c => !dismissed.has(c.id));

return (
  <AnimatePresence>
    {visibleCards.map(card => (
      <Card
        key={card.id}
        card={card}
        onDismiss={() => dispatch({ type: 'DISMISS_CARD', id: card.id })}
      />
    ))}
  </AnimatePresence>
);
```

### Pattern 3: Reveal Sequence as Orchestrated Animation (not state transitions)

**What:** The reveal is a multi-step visual sequence: (1) remaining cards fly off screen, (2) spotlight appears, (3) @chadcluff card scales to center, (4) confetti fires, (5) hero text fades in. This is NOT driven by multiple state transitions — it is driven by Framer Motion's `useAnimation` with `await controls.start()` calls chained in a `useEffect`.

**When to use:** When animation steps must happen in a precise sequence with timing coordination. React state updates are too coarse-grained for frame-by-frame choreography.

**Trade-offs:** Animation logic lives in a hook, not in state. Debugging requires understanding Framer Motion's animation controls API. Keep the sequence in `useRevealSequence.ts` — do not scatter it across components.

**Example:**
```typescript
// hooks/useRevealSequence.ts
export function useRevealSequence() {
  const heroControls = useAnimation();
  const spotlightControls = useAnimation();

  async function runReveal() {
    await spotlightControls.start({ opacity: 1, transition: { duration: 0.4 } });
    await heroControls.start({ scale: 1, opacity: 1, transition: { duration: 0.8, type: 'spring' } });
    // confetti fires via state flag after hero lands
  }

  return { heroControls, spotlightControls, runReveal };
}
```

## Data Flow

### User Interaction Flow

```
User taps X button or completes swipe gesture
    ↓
useSwipeDismiss hook / onClick handler
    ↓
dispatch({ type: 'DISMISS_CARD', id })
    ↓
appReducer computes new state
    ├── dismissed.add(id)
    ├── remaining = cards not dismissed and not chadcluff
    └── if remaining.length === 0 → phase = 'reveal'
    ↓
React re-renders — card removed from visibleCards
    ↓
AnimatePresence detects card removed → plays exit animation
    ↓
Card unmounts after animation completes
    ↓
If phase === 'reveal' → RevealScene mounts, useRevealSequence fires
```

### State Management

```
appReducer (single source of truth)
    ↓ (state passed via React context or prop drilling — context preferred)
CardDeckScene / RevealScene / PostRevealScene
    ↓ (user actions)
dispatch(action)
    ↑
No external state library needed — useReducer + Context is sufficient for this scope
```

### Key Data Flows

1. **Celebrity data:** `src/data/celebrities.ts` → imported at module level → initial `AppState.cards` array → never changes at runtime (static). The refresh script writes to this file; no runtime fetching.

2. **Dismiss flow:** Card component dispatches → reducer updates `dismissed` set → `CardDeckScene` recomputes `visibleCards` → `AnimatePresence` orchestrates exit animation → card unmounts.

3. **Reveal flow:** `dismissed` set reaches full non-chad count → phase transitions to `reveal` → `RevealScene` mounts → `useRevealSequence` hook runs async animation sequence → phase transitions to `post` after sequence completes.

4. **Replay flow:** `PostRevealScene` dispatches `REPLAY` → reducer resets `dismissed` to empty set and `phase` to `browsing` → `CardDeckScene` re-mounts with all cards → `AnimatePresence` animates them in.

## Scaling Considerations

| Scale | Architecture Adjustments |
|-------|--------------------------|
| 0–100k visitors | Current architecture is fine — static HTML/JS/CSS on CDN, no origin servers hit |
| 100k+ visitors | No changes needed — Cloudflare CDN handles this trivially for static assets |
| Celebrity data grows to 50+ cards | Grid pagination or virtual scrolling; current flat array is fine for 20 |
| Personalization (future) | Would require auth layer and server-side rendering; out of scope for v1 |

### Scaling Priorities

1. **First bottleneck (if any):** Image loading — celebrity photos need lazy loading and responsive sizes. `loading="lazy"` on all card images. Keep photos under 100KB each.
2. **Second bottleneck:** Animation jank on mid-range phones — Framer Motion runs on the JS thread. Use `transform` and `opacity` only (GPU-composited properties). Avoid animating `width`, `height`, `top`, `left`.

## Anti-Patterns

### Anti-Pattern 1: Multiple React Router Routes for Scenes

**What people do:** Create `/`, `/reveal`, `/post-reveal` routes and navigate between them to manage the three phases.

**Why it's wrong:** This is a single linear narrative — not a navigable multi-page app. Using routes breaks the browser back button (user presses back and leaves the experience entirely or gets stuck in a loop), complicates animation handoffs between scenes, and makes the state machine harder to reason about.

**Do this instead:** A single route `/` that conditionally renders the active scene based on `AppState.phase`. The URL never changes during the experience.

### Anti-Pattern 2: Updating Dismissed State Before Exit Animation Completes

**What people do:** Dispatch `DISMISS_CARD` immediately on user tap, which removes the card from `visibleCards` before `AnimatePresence` can animate it out.

**Why it's wrong:** The card disappears instantly instead of animating. Users see a jarring jump rather than the satisfying swipe-away.

**Do this instead:** Trigger the dismiss gesture animation first, then dispatch on `onAnimationComplete`. Or keep the card in `visibleCards` but mark it as `isDismissing`, let the animation play, then dispatch on completion.

### Anti-Pattern 3: CSS Animations for the Reveal Sequence

**What people do:** Trigger the reveal sequence with CSS class additions and `animation-delay` chains.

**Why it's wrong:** CSS animations are fire-and-forget — you cannot await them, chain them conditionally, or cancel them mid-sequence. The reveal sequence requires imperative async control ("do A, then B, then fire confetti").

**Do this instead:** Framer Motion `useAnimation` with `await controls.start()` for each step. This keeps timing in JS where it can be reasoned about and tested.

### Anti-Pattern 4: Fetching Twitter API at Runtime

**What people do:** Call the Twitter/X API from the client to load fresh celebrity data on page load.

**Why it's wrong:** Twitter API has strict rate limits, requires OAuth, and costs money at scale. Adds a loading state to the experience, breaking the instant-load feel. The project constraint explicitly forbids this.

**Do this instead:** Hardcode data in `src/data/celebrities.ts`. Run `scripts/refresh-data.ts` periodically to update the file and redeploy. Static data, instant load.

## Integration Points

### External Services

| Service | Integration Pattern | Notes |
|---------|---------------------|-------|
| Cloudflare Pages | Deploy `build/client/` directory; add `_redirects` with `/* /index.html 200` | Cloudflare Pages auto-detects SPAs if no 404.html exists — confirm behavior in deployment |
| Twitter/X (share) | Pre-composed URL: `https://twitter.com/intent/tweet?text=...` opened in new tab | No API key needed — uses Twitter Web Intents |
| Twitter/X (data) | None at runtime — data populated by offline refresh script | Script uses Twitter API v2 with elevated access; run locally or in CI |

### Internal Boundaries

| Boundary | Communication | Notes |
|----------|---------------|-------|
| `App` ↔ `scenes/*` | React Context (`AppContext`) providing `state` and `dispatch` | Prop drilling is acceptable for this small tree, but Context avoids threading dispatch through Card → DismissButton |
| `scenes/*` ↔ `components/*` | Props only — components are stateless | Components receive data and callbacks; no direct state access |
| `hooks/useRevealSequence` ↔ `RevealScene` | Hook returns `controls` objects and `runReveal()` function | RevealScene calls `runReveal()` on mount; hook owns animation timing |
| `data/*` ↔ `state/appReducer` | Import at module level — `celebrities` array used as `initialState.cards` | No runtime coupling; data is a pure TypeScript constant |

## Build Order Implications

Components depend on each other in this sequence — build in this order to avoid blocked work:

1. **Static data + types** (`src/data/`, `src/state/types.ts`) — no dependencies; everything else depends on `CelebrityCard` type
2. **App state reducer** (`src/state/appReducer.ts`) — depends on types only
3. **Card component** (`src/components/Card/`) — depends on types; used in all scenes
4. **CardDeckScene** — depends on Card + state; the first meaningful interactive thing
5. **Swipe gesture hook** (`hooks/useSwipeDismiss.ts`) — can be built alongside Card
6. **RevealScene + useRevealSequence hook** — depends on HeroCard component and state `phase === 'reveal'`
7. **PostRevealScene** — depends on state `phase === 'post'` and ShareButton
8. **Cyberpunk styling** (`styles/`) — can be layered in at any point; start with globals early, refine aesthetics last
9. **Refresh script** (`scripts/refresh-data.ts`) — independent of app; can be built any time

## Sources

- [React Router 7 — SPA Mode](https://reactrouter.com/how-to/spa) (official docs)
- [React Router 7 — Picking a Mode](https://reactrouter.com/start/modes) (official docs)
- [Cloudflare Workers — React Router guide](https://developers.cloudflare.com/workers/framework-guides/web-apps/react-router/)
- [Cloudflare Pages — React site deployment](https://developers.cloudflare.com/pages/framework-guides/deploy-a-react-site/)
- [Motion — AnimatePresence](https://motion.dev/docs/react-animate-presence) (official docs)
- [Motion — React animation](https://motion.dev/docs/react-animation) (official docs)
- [Advanced animation patterns with Framer Motion](https://blog.maximeheckel.com/posts/advanced-animation-patterns-with-framer-motion/)
- [Tinder-like card game with Framer Motion](https://dev.to/lansolo99/a-tinder-like-card-game-with-framer-motion-35i5)
- [State Machines in React — useReducer](https://medium.com/@ipla/the-beauty-of-state-machines-in-react-7b340676ceb8)
- [Cloudflare Pages — SPA routing](https://www.codemzy.com/blog/cloudflare-reactjs-spa-routing)

---
*Architecture research for: Interactive cyberpunk card-game SPA — twittercelebrity.com*
*Researched: 2026-03-15*
