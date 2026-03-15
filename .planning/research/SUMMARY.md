# Project Research Summary

**Project:** twittercelebrity.com — Interactive Cyberpunk Card-Game Celebrity Reveal Landing Page
**Domain:** Animated single-page experience / personal brand landing page
**Researched:** 2026-03-15
**Confidence:** HIGH

## Executive Summary

This project is a single-page interactive experience built as a Tinder-style card-dismissal game where visitors swipe away Twitter/X celebrities until only @chadcluff remains — a dramatic personal brand reveal with cyberpunk aesthetics. Expert implementations of this pattern are well-documented: React Router 7 in SPA mode (`ssr: false`) on Cloudflare Pages static hosting is the correct stack, with Framer Motion handling all card gestures and animation orchestration. The entire product experience lives on one route, driven by a finite state machine (`browsing → reveal → post`) that gates scene transitions based on how many cards have been dismissed. No backend is required — all celebrity data is static TypeScript, all images are self-hosted, and viral sharing uses Twitter Web Intents (no API key).

The recommended approach prioritizes the static deployment skeleton first, because the most critical pitfall (SPA routing misconfiguration on Cloudflare Pages) will silently break the product on deploy if not caught early. The second priority is the card dismissal mechanic, which requires careful coordination of Framer Motion's `AnimatePresence`, stable card keys, and CSS `touch-action` for mobile gesture correctness. The reveal sequence — the emotional payoff of the entire experience — must be treated as a three-act orchestrated animation, not a single state transition, with dedicated timing review to ensure it lands as a cinematic event rather than a functional state change.

The primary risks are all well-known and preventable: SPA routing misconfiguration, broken celebrity images from third-party CDNs, silent AnimatePresence failures from unstable card keys, and mobile swipe/scroll gesture conflicts. Each has a clear prevention strategy that should be addressed in the corresponding phase. There are no significant unknowns in the stack or architecture — this is a well-trodden pattern with high-confidence sources across all research areas.

## Key Findings

### Recommended Stack

React Router 7 (v7.13.1) with `ssr: false` is the mandated framework and the correct choice — it produces a static SPA bundle that Cloudflare Pages serves at zero cost with no server runtime. Tailwind CSS v4 (CSS-first, no JS config) handles cyberpunk neon effects cleanly via utility classes and CSS custom properties in `@theme`. Framer Motion v12 covers all animation needs — card drag gestures, exit animations, and reveal sequence orchestration — eliminating the need for any separate gesture library. `canvas-confetti` (3 KB) is the right choice for the one-shot confetti burst at reveal; avoid tsParticles (45+ KB) for this use case.

**Core technologies:**
- React Router 7.13.1 (SPA mode, `ssr: false`): Framework, routing, static build — mandated by project; outputs to `build/client/` for Cloudflare Pages
- React 19.x: UI rendering — concurrent features improve layout animation performance with Framer Motion 12
- TypeScript 5.9.x: Type safety — React Router 7 generates typed route modules; skipping it loses free `loaderData` inference
- Vite 8.x: Build tool — bundled with React Router 7; uses Rolldown internally for fast incremental builds
- Tailwind CSS 4.2.x: Styling — CSS-first v4 with `@theme` tokens is ideal for cyberpunk neon color system; 100x faster incremental builds than v3
- Framer Motion 12.x: All animations and gestures — `drag` prop + `useMotionValue` + `AnimatePresence` handles the full card interaction surface; no additional gesture library needed
- canvas-confetti 1.9.4: Confetti burst on reveal — 3 KB, zero dependencies, fire-and-forget

**Do not use:** react-tinder-card (unmaintained), react-spring (inferior orchestration API), Twitter/X API at runtime (rate-limited, costly, breaks static constraint), Next.js (not mandated, overkill for single page).

### Expected Features

The feature set has two clear tiers: a small, high-value MVP that constitutes the entire product promise, and a polish layer of differentiators that elevate the aesthetic without being required for launch.

**Must have (table stakes) — P1:**
- Celebrity static data (JSON/TS) with photo, handle, bio, follower count — all other features depend on this
- Card deck grid display with cyberpunk styling — the game board
- Swipe-to-dismiss touch gesture with drag tilt feedback — core mechanic; absence breaks mobile experience
- X button dismiss — required for mouse users and accessibility; shares logic with swipe
- Dismiss count tracking — single piece of state that powers reveal trigger, progress indicator, and personalized share text
- Dramatic reveal animation (cards fly away, spotlight, confetti, @chadcluff hero expands) — the entire product promise
- @chadcluff hero screen with Follow CTA, Share on X button, and Replay button
- Responsive mobile layout (375px+), consistent cyberpunk design system, `prefers-reduced-motion` support

**Should have (differentiators) — P2, add after validation:**
- Glitch effects on card hover and reveal transitions — primary visual differentiator vs generic card UIs; pure CSS, low cost
- Staggered card entry animation — communicates "game starting"; Framer Motion `staggerChildren`
- Progress indicator (cards remaining) — builds suspense; state already exists, just add the UI
- Spotlight/vignette on reveal — cinematic; CSS radial gradient with animation
- Sound design (opt-in, muted by default) — highest atmosphere value; must be user-initiated

**Defer (v2+):**
- Twitter OAuth login + personalized deck — explicitly deferred in project spec; significant complexity
- OG image generation for share cards — requires edge function or static pre-generation
- Multiple deck themes (musicians, athletes, etc.) — replayability; needs content curation investment

**Anti-features to reject outright:** Undo last dismiss (undermines game tension), random card order (breaks designed pacing), real-time Twitter API data (breaks static constraint), political figures (per project spec).

### Architecture Approach

The entire experience is a finite state machine with three phases (`browsing → reveal → post`), implemented as a single React Router route that conditionally renders scene components based on phase. State is managed with `useReducer` + React Context — no external state library needed for this scope. The reveal sequence is an orchestrated async animation using Framer Motion `useAnimation` hooks (not React state transitions), allowing precise timing control with `await controls.start()` chained calls. All celebrity data is a static TypeScript array, loaded at module level with no runtime fetching.

**Major components:**
1. `App` (root route) — hosts `useReducer` state, provides `AppContext` to all scenes
2. `CardDeckScene` — renders dismissible card grid; phase `browsing`
3. `Card` — celebrity card UI, drag gesture via Framer Motion `drag` prop, dispatch dismiss action on swipe/click
4. `RevealScene` — dramatic animation sequence; orchestrated via `useRevealSequence` hook; phase `reveal`
5. `PostRevealScene` — CTA, share button, replay; @chadcluff hero treatment; phase `post`
6. `appReducer` — single source of truth; computes phase transitions from dismiss actions
7. Static data layer (`src/data/celebrities.ts`) — pure TypeScript constants, no runtime coupling

**Build order implied by dependencies:** static data + types → app state reducer → Card component → CardDeckScene → gesture hook → RevealScene + reveal hook → PostRevealScene → cyberpunk styling polish.

### Critical Pitfalls

1. **React Router 7 SPA misconfiguration on Cloudflare Pages** — set `ssr: false` in `react-router.config.ts`, add `_redirects` (`/* /index.html 200`) to `public/`, never include `404.html` in build output, and deploy a skeleton app on day one to confirm routing before building anything else.

2. **AnimatePresence exit animations silently fail** — always use stable, unique `key` props on cards (never array index), never conditionally mount/unmount `AnimatePresence` itself, and dispatch dismiss state only after `onAnimationComplete` fires — not before.

3. **Swipe gesture conflicts with browser scroll on mobile** — use Framer Motion's built-in `drag` prop (handles passive listener negotiation), set `touch-action: none` on swipeable card elements, and test on real iOS and Android hardware (Chrome DevTools simulator does not accurately reproduce passive event behavior).

4. **Celebrity images break from third-party CDN URLs** — download all celebrity profile photos and host them as static assets in `public/images/celebrities/`. Never link to `pbs.twimg.com` in production. Add `<img>` `onError` fallback as a safety net.

5. **Reveal animation feels wrong (too fast, unearned, or mistimed)** — treat reveal as a three-act sequence: staggered card exit → 300-500ms pause → @chadcluff entrance. Use `onAnimationComplete` callbacks to gate each phase, never `setTimeout`. Keep total sequence under 3 seconds. Budget dedicated design review time — this is the emotional core of the product.

## Implications for Roadmap

Based on research, the architecture's build-order requirements and pitfall phase mappings point clearly to a four-phase roadmap:

### Phase 1: Foundation, Deployment, and Static Data

**Rationale:** The most critical pitfall (SPA routing misconfiguration) must be caught before any feature work. Deploying a skeleton immediately also validates the Cloudflare Pages build pipeline. Static data and types must exist before any component can reference them — every other component depends on `CelebrityCard` type.

**Delivers:** Working React Router 7 SPA deployed to Cloudflare Pages, celebrity TypeScript data file with all 15-20 entries, local profile images in `public/images/celebrities/`, Tailwind CSS v4 configured with cyberpunk design tokens (`@theme` neon palette, dark background, font), global CSS (`globals.css`, `cyberpunk.css`), and TypeScript app state types.

**Addresses:** Celebrity static data, cyberpunk design system (tokens layer only)

**Avoids:** SPA routing misconfiguration (validate on day one), broken celebrity images (download locally from the start)

**Research flag:** Standard patterns — no additional research needed. Deploy to Cloudflare Pages is well-documented.

### Phase 2: Card Grid and Dismiss Mechanics

**Rationale:** The card grid and dismiss interaction are the foundational game mechanics; everything else (reveal, post-reveal) depends on them being correct. The AnimatePresence and gesture pitfalls must be addressed here, with explicit testing on real mobile hardware before this phase closes.

**Delivers:** `appReducer` with phase state machine, `CardDeckScene` rendering all celebrity cards in a responsive grid, `Card` component with cyberpunk styling, X button dismiss, swipe-to-dismiss gesture via Framer Motion `drag` prop, drag tilt visual feedback, dismiss count tracking state, and `AnimatePresence` exit animations on card removal.

**Uses:** Framer Motion 12 (`drag`, `AnimatePresence`, `useMotionValue`, `useTransform`), Tailwind CSS cyberpunk card styles, `touch-action` CSS

**Implements:** Card component, CardDeckScene, appReducer, useSwipeDismiss hook

**Avoids:** AnimatePresence silent failures (stable keys, correct placement), mobile gesture/scroll conflict (Framer Motion `drag` + `touch-action`)

**Research flag:** Standard patterns — Framer Motion drag and AnimatePresence are well-documented. No additional research needed.

### Phase 3: Reveal Sequence and Post-Reveal Screen

**Rationale:** The reveal depends on the dismiss mechanics being complete and stable. This phase contains the highest design/UX risk in the project — the reveal animation timing must feel like an event, not a transition. Budget explicit review time here.

**Delivers:** `RevealScene` with orchestrated three-act animation (staggered card exit → spotlight → @chadcluff hero entrance + confetti), `useRevealSequence` hook with `useAnimation` async sequence, `canvas-confetti` integration, `PostRevealScene` with @chadcluff hero treatment, Follow CTA (Twitter/X link), Share on X button (Web Intent URL with personalized dismiss count), and Replay button.

**Uses:** Framer Motion `useAnimation`, `canvas-confetti`, Twitter Web Intent URL

**Implements:** RevealScene, PostRevealScene, useRevealSequence hook, HeroCard, ShareButton

**Avoids:** Reveal timing pitfall (three-act structure, `onAnimationComplete` gating, dedicated timing review), share button URL encoding errors (`encodeURIComponent`)

**Research flag:** The reveal sequence orchestration is a medium-complexity Framer Motion pattern. No additional research needed, but allocate time for timing tuning — this is the emotional core of the product and will require iteration.

### Phase 4: Polish, Accessibility, and Launch Validation

**Rationale:** Differentiating visual effects (glitch, stagger, progress indicator) should be layered on after core mechanics are confirmed stable. Accessibility (`prefers-reduced-motion`) and the "looks done but isn't" checklist belong here to catch deployment and edge-case failures before public launch.

**Delivers:** CSS glitch effects on card hover and reveal (`clip-path` + `@keyframes`), staggered card entry animation on page load, progress indicator (cards remaining), spotlight/vignette on reveal, `prefers-reduced-motion` support wrapping all animations, Framer Motion `useReducedMotion()` hook at app root, image `onError` fallback handlers, full "looks done but isn't" checklist validation.

**Addresses:** Glitch effects, staggered entry, progress indicator, spotlight, `prefers-reduced-motion` (P2 features)

**Avoids:** `prefers-reduced-motion` not respected, performance jank from too many concurrent glitch animations (limit to 1-2 elements)

**Research flag:** Standard patterns — CSS glitch effects and `prefers-reduced-motion` are well-documented. No additional research needed.

### Phase Ordering Rationale

- **Data before components:** `CelebrityCard` type and static data array are imported by every component. Building them first eliminates blocked work.
- **Deploy before build:** Cloudflare Pages SPA routing is the highest-risk configuration item. Catching it on day one costs 30 minutes; catching it post-feature-build costs a day of debugging.
- **Core mechanics before polish:** The reveal sequence depends on dismissal being correct. Polish (glitch, stagger, sound) depends on the reveal being validated. Reversing this order creates rework.
- **Pitfall alignment:** Each pitfall maps to a specific phase. Phase 1 addresses the two infrastructure pitfalls; Phase 2 addresses the two interaction pitfalls; Phase 3 addresses the reveal timing pitfall; Phase 4 addresses accessibility pitfalls.

### Research Flags

Phases likely needing deeper research during planning:
- None identified. All four phases have well-documented patterns with high-confidence sources. The stack, animation library, and deployment target are all mature with official documentation.

Phases with standard patterns (skip research-phase):
- **Phase 1:** React Router 7 SPA + Cloudflare Pages deployment is documented in official guides.
- **Phase 2:** Framer Motion `drag` + `AnimatePresence` patterns are documented in official Motion docs and multiple tutorials.
- **Phase 3:** Framer Motion `useAnimation` orchestration and `canvas-confetti` are straightforward integrations.
- **Phase 4:** CSS glitch effects and `prefers-reduced-motion` are well-established techniques.

## Confidence Assessment

| Area | Confidence | Notes |
|------|------------|-------|
| Stack | HIGH | All versions verified via npm registry and official docs. One LOW-confidence note: Cloudflare Vite plugin + SPA mode has an open GitHub discussion (#12998) — the `ssr: false` without the plugin workaround is confirmed to work. |
| Features | HIGH (core) / MEDIUM (cyberpunk-specific) | Core swipe mechanics and reveal patterns are well-documented. Cyberpunk web implementation details sourced from community tutorials rather than official specs. |
| Architecture | HIGH | Phase state machine, AnimatePresence patterns, and Cloudflare static deployment architecture are all verified against official documentation and established React patterns. |
| Pitfalls | HIGH (RR7, AnimatePresence, performance) / MEDIUM (mobile gestures, glitch perf) | React Router 7 SPA misconfiguration and AnimatePresence pitfalls sourced from official docs and active community reports. Mobile gesture behavior sourced from community; recommend device testing as verification. |

**Overall confidence:** HIGH

### Gaps to Address

- **Cloudflare Vite plugin SPA mode compatibility:** GitHub Discussion #12998 indicates a potential conflict between `@react-router/cloudflare` Vite plugin and pure SPA mode. The confirmed workaround is `ssr: false` without the plugin for static deployments. Validate on first deploy and monitor the discussion for resolution if the project later needs Workers bindings.
- **Sound design implementation:** If sound is added in v1.x, the specific Web Audio API vs. Howler.js decision and autoplay policy handling will need a targeted spike. This is deferred from the current roadmap.
- **Celebrity data refresh cadence:** The offline `scripts/refresh-data.ts` script is referenced in the architecture but not scoped. A build-time CI automation or manual refresh process should be decided before launch.

## Sources

### Primary (HIGH confidence)
- [React Router 7 — Rendering Strategies](https://reactrouter.com/start/framework/rendering) — SPA mode `ssr: false` config
- [React Router 7 — Pre-Rendering How-To](https://reactrouter.com/how-to/pre-rendering) — static build output to `build/client/`
- [React Router 7 — SPA How-To](https://reactrouter.com/how-to/spa) — SPA mode configuration
- [Cloudflare Pages — Deploy a React Site](https://developers.cloudflare.com/pages/framework-guides/deploy-a-react-site/) — build command and output dir
- [Cloudflare Pages — Serving Pages / SPA routing](https://developers.cloudflare.com/pages/configuration/serving-pages/) — `_redirects` behavior
- [Motion — AnimatePresence](https://motion.dev/docs/react-animate-presence) — exit animation patterns
- [Motion — Drag API](https://motion.dev/docs/react-drag) — drag prop + useMotionValue
- [Motion — Swipe Actions tutorial](https://motion.dev/tutorials/react-swipe-actions) — swipe gesture implementation
- [npm: react-router@7.13.1](https://www.npmjs.com/package/react-router) — version confirmed
- [npm: framer-motion@12.x](https://www.npmjs.com/package/framer-motion) — version confirmed
- [Tailwind CSS v4.0 announcement](https://tailwindcss.com/blog/tailwindcss-v4) — CSS-first config confirmed
- [prefers-reduced-motion — MDN](https://developer.mozilla.org/en-US/docs/Web/CSS/@media/prefers-reduced-motion) — accessibility pattern
- [Cumulative Layout Shift — web.dev](https://web.dev/articles/optimize-cls) — image loading best practices

### Secondary (MEDIUM confidence)
- [Framer Motion swipe card tutorial — dev.to](https://dev.to/lansolo99/a-tinder-like-card-game-with-framer-motion-35i5) — card game implementation pattern
- [CSS cyberpunk glitch effect](https://ahmodmusa.com/create-cyberpunk-glitch-effect-css-tutorial/) — clip-path glitch technique
- [Cyberpunk button glitch — SitePoint](https://www.sitepoint.com/recreate-the-cyberpunk-2077-button-glitch-effect-in-css/) — CSS glitch variation
- [Cloudflare Pages SPA routing — Codemzy](https://www.codemzy.com/blog/cloudflare-reactjs-spa-routing) — `_redirects` setup
- [AnimatePresence common bug — JS Decoded](https://medium.com/javascript-decoded-in-plain-english/understanding-animatepresence-in-framer-motion-attributes-usage-and-a-common-bug-914538b9f1d3) — key prop pitfall
- [Advanced Framer Motion patterns — Maxime Heckel](https://blog.maximeheckel.com/posts/advanced-animation-patterns-with-framer-motion/) — orchestration patterns

### Tertiary (LOW confidence / monitor)
- [React Router + Cloudflare Pages SPA issue](https://github.com/remix-run/react-router/discussions/12998) — open discussion on Vite plugin SPA mode conflict; confirmed workaround exists but monitor for updates
- [Motion vs GSAP comparison](https://motion.dev/docs/gsap-vs-motion) — inherently biased source (Motion's own docs), used only to confirm bundle size claims

---
*Research completed: 2026-03-15*
*Ready for roadmap: yes*
