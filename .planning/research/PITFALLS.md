# Pitfalls Research

**Domain:** Animated interactive card-game landing page (React Router 7 + Framer Motion + Cloudflare Pages)
**Researched:** 2026-03-15
**Confidence:** HIGH (React Router 7 SPA/deployment issues) / HIGH (Framer Motion AnimatePresence) / MEDIUM (gesture/mobile) / HIGH (animation performance)

---

## Critical Pitfalls

### Pitfall 1: React Router 7 SPA Mode Misconfiguration Breaks All Non-Root Routes

**What goes wrong:**
The site deploys and the home page loads fine. But direct links, page refreshes, or any URL that is not `/` returns a 404. The card game loads at `/` but if a user shares a deep link or bookmarks a path, it is dead.

**Why it happens:**
React Router 7 in SPA mode requires explicit `ssr: false` in `react-router.config.ts`. Without it, or if the static host is not configured to rewrite all URLs to `index.html`, the server looks for a matching file that does not exist. This is compounded by a Cloudflare Pages quirk: if a `404.html` file exists anywhere in the build output, Cloudflare's automatic SPA fallback behavior is disabled.

**How to avoid:**
1. Set `ssr: false` in `react-router.config.ts` — this is the single most important config flag.
2. Add `HydrateFallback` export to the root route (required by SPA mode).
3. Add a `_redirects` file to the `public/` folder: `/* /index.html 200`
4. Do NOT include a `404.html` in the build output — its presence disables Cloudflare's automatic SPA routing fallback.
5. Verify the `_redirects` file uses UTF-8 encoding with LF line endings — Windows CRLF line endings silently break it.

**Warning signs:**
- Home page loads but any non-root URL returns Cloudflare's 404 page
- Build output contains a `404.html` file
- Vite config has no `ssr: false` flag
- `react-router.config.ts` is absent from the project root

**Phase to address:** Foundation/setup phase (phase 1). This must be validated before any other work begins. Deploy a skeleton app on day one to confirm routing works end-to-end.

---

### Pitfall 2: AnimatePresence Exit Animations Silently Fail on Card Dismissal

**What goes wrong:**
Cards are removed from the array state, but instead of animating out they just vanish instantly. The `exit` prop on `motion.div` is defined correctly but nothing happens. This breaks the core mechanic — dismissal feels broken rather than satisfying.

**Why it happens:**
Four common causes:
1. `AnimatePresence` is placed inside a conditional render — if `AnimatePresence` itself unmounts, exit animations cannot run.
2. Children of `AnimatePresence` are missing `key` props, or `key` is array index rather than a stable card ID. When the array is spliced, React reuses the DOM node instead of unmounting it.
3. A custom component wraps the `motion.div` but is not a direct child of `AnimatePresence` and does not forward the required props.
4. `layout` prop is combined with `exit` — there is a known bug where concurrent layout + exit animations cause the exit to be skipped.

**How to avoid:**
- Each card must have a stable, unique `key` prop (e.g., the celebrity's ID, never array index).
- `AnimatePresence` must always be rendered — never conditionally mount/unmount it; only its children unmount.
- Keep `AnimatePresence` as a direct parent of the animated card list, not buried inside conditional JSX.
- If using `layout` on cards for reflow, test exit animations explicitly — do not combine `layout` and `exit` on the same element without verifying they coexist.

**Warning signs:**
- Cards disappear on dismiss with no animation
- Console warning about missing `key` props
- `AnimatePresence` is inside a ternary expression
- Cards use array index as key (`key={index}`)

**Phase to address:** Card interaction phase. Write a focused test for the dismiss animation immediately after implementing card state management.

---

### Pitfall 3: Swipe Gesture Conflicts with Browser Scroll on Mobile

**What goes wrong:**
On touch devices, the horizontal swipe-to-dismiss gesture conflicts with the browser's vertical scroll. Users trying to swipe a card trigger a page scroll instead. Alternatively, `preventDefault()` calls on touch events produce a console error: "Unable to preventDefault inside passive event listener" — and the gesture does not prevent scroll.

**Why it happens:**
Since Chrome 56 (and Safari shortly after), `touchstart` and `touchmove` listeners are passive by default, meaning the browser starts scrolling immediately without waiting for JavaScript. Any attempt to call `preventDefault()` inside a passive listener is silently ignored on some browsers and throws a warning on others. Framer Motion's drag gesture respects this in most cases, but custom gesture implementations do not.

**How to avoid:**
- Use Framer Motion's built-in `drag` gesture with `dragDirectionLock: true` — it handles passive listener negotiation correctly.
- Set the CSS property `touch-action: pan-y` on vertically scrollable containers and `touch-action: none` on swipeable card elements. This tells the browser which axis belongs to native scroll vs. JS gesture.
- Validate swipe threshold before acting: only treat a touch as a swipe if horizontal delta exceeds ~50px and horizontal delta exceeds vertical delta.
- Never add raw `touchstart`/`touchmove` listeners without `{ passive: false }` on elements where you need to `preventDefault()`.

**Warning signs:**
- "Unable to preventDefault inside passive event listener" in the browser console
- Vertical scroll triggers when user intends to swipe a card horizontally
- Swipe only works on desktop, not mobile
- `touch-action` is not set on card elements

**Phase to address:** Card interaction + gesture phase. Test on a real iOS device (not just Chrome DevTools simulator) — iOS and Android have subtle differences in passive listener behavior.

---

### Pitfall 4: Reveal Animation Timing Is Either Too Fast or Unearned

**What goes wrong:**
The payoff moment — when the final celebrity card (chadcluff) takes center stage — either happens too quickly (users miss it) or is stretched so long it feels tedious. The animation plays but users do not feel the weight of the moment.

**Why it happens:**
Developers optimize for technical correctness (does it animate?) rather than emotional timing (does it feel like an event?). The mistake is treating the reveal as a single animation instead of a sequence: cards clearing out, a beat of silence/anticipation, then the reveal. The intermediate pause — which exists in great card reveals — gets cut in development because developers want to iterate quickly.

**How to avoid:**
- Treat the reveal as a three-act sequence: (1) dismiss remaining cards with staggered `exit` animations, (2) a deliberate 300-500ms pause before anything new appears, (3) the @chadcluff card entrance.
- Use Framer Motion's `staggerChildren` on the exit animations so cards clear sequentially, not all at once.
- Use `onAnimationComplete` callbacks to gate each phase — do not use `setTimeout` for sequencing because it races with animation duration.
- Keep total reveal sequence under 3 seconds on fast connection. Over 3 seconds feels like loading, not drama.

**Warning signs:**
- All cards disappear simultaneously in a single frame
- The chadcluff card appears before exit animations complete
- No perceptible pause between "all gone" and "reveal"
- `setTimeout` is used to sequence animations (brittle, breaks at different animation speeds)

**Phase to address:** Reveal animation phase. Budget dedicated design/review time here — this is the emotional core of the product.

---

### Pitfall 5: Celebrity Profile Images Break at Runtime

**What goes wrong:**
Celebrity photos are hardcoded from Twitter/X CDN URLs (`pbs.twimg.com`). At some point after deployment they become broken image placeholders. The site looks broken regardless of how polished everything else is.

**Why it happens:**
Twitter/X profile images hosted at `pbs.twimg.com` are not stable permanent URLs. They rotate, expire, or change when a user updates their avatar. The CDN URL format has changed before. Additionally, hotlink protection or CORS headers on the CDN may block direct `<img>` embedding from a third-party domain.

**How to avoid:**
- Download celebrity profile images and host them as static assets in the project repository (or Cloudflare Pages public directory). This is the only reliable approach for a static site with no backend.
- Write the refresh script to download images locally, not reference them by URL. Store in `public/images/celebrities/`.
- Add an `<img>` `onError` handler that falls back to a stylized placeholder — this is a safety net, not the primary strategy.
- Include image attribution/source tracking in the static data file so images can be identified and re-fetched when needed.

**Warning signs:**
- Any celebrity image `src` points to `pbs.twimg.com` or another third-party CDN
- No fallback `onError` handler on `<img>` tags
- No image assets checked into the repository

**Phase to address:** Data modeling and asset pipeline phase. The refresh script must download images locally from the start — retrofitting this later means re-downloading all assets.

---

## Technical Debt Patterns

| Shortcut | Immediate Benefit | Long-term Cost | When Acceptable |
|----------|-------------------|----------------|-----------------|
| Array index as card key | Simple code | AnimatePresence exit animations break silently; hard to debug | Never |
| Linking directly to Twitter CDN for celebrity images | No build step needed | Images break within weeks/months | Never |
| `setTimeout` for animation sequencing | Looks correct in dev | Races animation durations; breaks if animation speed changes | Never |
| Animating `width`/`height` properties directly | Intuitive | Triggers browser layout/paint on every frame; janky at 60fps | Never |
| Loading all Framer Motion features (`import { motion }`) | Fastest to write | 34kb minimum bundle vs. 4.6kb with `m` + `LazyMotion` | Acceptable in MVP if bundle size is not a concern |
| Hardcoding celebrity data inline in components | Fast prototype | Impossible to update without touching component code | Never — put in a data file from day one |
| Using CSS `clip-path` glitch effect on many elements simultaneously | Looks impressive | Multiple concurrent clip-path animations thrash paint; caps at a few elements before jank | Limit to 1-2 elements at a time |

---

## Integration Gotchas

| Integration | Common Mistake | Correct Approach |
|-------------|----------------|------------------|
| Cloudflare Pages SPA routing | Expecting Cloudflare to auto-detect SPA and serve `index.html` for all routes | Explicitly add `_redirects` file: `/* /index.html 200`; do not include `404.html` in build |
| React Router 7 SPA mode | Using `loader` functions on non-root routes | Only root route can have a `loader` in SPA mode (`ssr: false`); all others use `clientLoader` |
| Framer Motion `LazyMotion` | Importing `motion` globally while also using `LazyMotion` | Choose one: `motion` (full bundle) or `m` + `LazyMotion` (optimized); mixing them negates optimization |
| Twitter/X share URL | Constructing the share URL manually and URL-encoding it incorrectly | Use `https://twitter.com/intent/tweet?text=` with proper `encodeURIComponent()` on the text content |
| Cloudflare Pages custom domain | Pointing domain at Pages deployment and expecting HTTPS immediately | DNS propagation can take 5-30 minutes; Cloudflare certificate provisioning is automatic but not instant |

---

## Performance Traps

| Trap | Symptoms | Prevention | When It Breaks |
|------|----------|------------|----------------|
| Animating `left`/`top`/`margin` for card movement | Choppy animation, high CPU during swipe | Use `transform: translate()` exclusively for position changes | Immediately on mid-range mobile hardware |
| Running glitch effect on every card simultaneously | Page stutters when many cards are visible | Apply glitch effect only to cards in viewport focus; use CSS `steps()` timing function, not JS | When 10+ cards are rendered with animation |
| Mounting all 15-20 card `motion` components at once with `layout` prop | Noticeable render delay on first load | Use `layout` only on elements that actually need layout animation; consider virtual rendering for off-screen cards | First paint on mobile devices with slow CPUs |
| Re-rendering entire card list on each dismiss | Dismiss causes all remaining cards to re-render | Use `React.memo` on card component; key by stable ID not index | Noticeable at 5+ remaining cards with complex animation states |
| Unthrottled touch move handlers without `passive` flag | Console warnings; scroll jank | Set `touch-action` in CSS; use Framer Motion's `drag` instead of raw touch events | All mobile devices, Chrome 56+ |

---

## UX Pitfalls

| Pitfall | User Impact | Better Approach |
|---------|-------------|-----------------|
| No skip/fast-forward on reveal animation | Users who replay the game wait through the full animation sequence again | Add a "replay" path that skips the slow reveal and jumps to the final state, or make the replay button start from the card grid |
| Dismissal is irreversible with no visual affordance | Users dismiss a card accidentally and cannot undo; feel frustrated | Add a visible undo/restore option for the most recently dismissed card, or a brief "dismissed" toast with undo |
| X button too small on mobile for dismissal | Fat-finger misses; users accidentally interact with the card instead of dismissing it | Minimum 44x44px touch target for the dismiss X; position it away from card content hotspots |
| Swipe-to-dismiss works only left, not right | Users trained by Tinder to swipe either direction feel constrained | Support dismiss in both left and right directions; reserve up/down for scroll |
| No loading state for card images | Layout shift when images load; placeholder flash | Use explicit `width`/`height` on `<img>` elements; add a low-fi placeholder with CSS until image loads |
| Glitch/neon effects trigger vestibular issues | Users with motion sensitivity may feel ill | Implement `prefers-reduced-motion` media query that disables glitch animations and reduces motion to simple fades |
| Reveal CTA immediately follows animation with no pause | Users do not process the CTA before it appears | Delay CTA appearance by 500-800ms after the reveal completes so the reveal settles first |

---

## "Looks Done But Isn't" Checklist

- [ ] **SPA routing on Cloudflare:** The home page loads locally — verify that navigating directly to any other route (e.g., a future `/about`) does NOT return a Cloudflare 404. Deploy early and test.
- [ ] **Card dismiss animations:** Cards visually disappear on dismiss in dev — verify `AnimatePresence` + stable `key` props are in place so the `exit` animation actually runs rather than the component being instantly unmounted.
- [ ] **Mobile gesture vs. scroll:** Swipe works in Chrome DevTools mobile emulation — verify on a real iOS device and Android device. DevTools does not accurately simulate passive event listener behavior.
- [ ] **Celebrity images:** Images show in dev from localhost — verify all images are locally hosted static assets, not hotlinked from Twitter CDN.
- [ ] **Reveal sequence gating:** The reveal animation plays from start to finish in isolation — verify it works correctly after 14 rapid consecutive dismissals, not just when triggered manually from a clean state.
- [ ] **`prefers-reduced-motion`:** Glitch effects and entrance animations look great — verify that `@media (prefers-reduced-motion: reduce)` disables or simplifies all glitch animations. Enable "Reduce Motion" in macOS/iOS System Preferences and test.
- [ ] **Share button:** The "Share on X" button renders and looks right — verify the tweet URL correctly encodes the text and opens the Twitter intent URL (not the home page).
- [ ] **Replay button:** Clicking replay resets the game — verify card state fully resets (all dismissed cards return, @chadcluff card returns to deck, reveal state clears).
- [ ] **Cloudflare Pages build:** The app builds and runs locally — verify `npm run build` produces a `build/client/` output with no SSR artifacts and the `_redirects` file is present in the output.

---

## Recovery Strategies

| Pitfall | Recovery Cost | Recovery Steps |
|---------|---------------|----------------|
| SPA routing broken post-deploy | LOW | Add `_redirects` file to `public/` directory, push, redeploy. Takes ~5 minutes. |
| AnimatePresence exit animations not running | MEDIUM | Audit all `key` props on card elements, confirm `AnimatePresence` placement is not conditional. Usually a 30-minute fix once the cause is identified. |
| Celebrity images broken | MEDIUM | Write/run image download script, commit static images, update data file to point to local paths. 1-2 hours of work. |
| Gesture/scroll conflict on mobile | MEDIUM | Add `touch-action` CSS to card elements, switch custom gesture handling to Framer Motion `drag`. Requires device testing. |
| Reveal animation timing feels wrong | LOW | Adjust stagger delays, pause durations, and entrance timings — these are CSS/prop values, no architecture change needed. |
| `prefers-reduced-motion` not respected | LOW | Add a Framer Motion `useReducedMotion()` hook at the app root; gate all animation variants behind it. |

---

## Pitfall-to-Phase Mapping

| Pitfall | Prevention Phase | Verification |
|---------|------------------|--------------|
| React Router 7 SPA misconfiguration | Phase 1: Foundation & deployment skeleton | Deploy a skeleton app to Cloudflare Pages on day one; navigate to a non-root URL and confirm it loads |
| AnimatePresence exit animation failures | Phase 2: Card grid + dismiss mechanics | Write a specific test scenario: add 3 cards, dismiss each, confirm exit animation plays for all 3 |
| Swipe gesture / scroll conflict | Phase 2: Card interaction gestures | Manual test on real iOS and Android hardware before considering gestures "done" |
| Celebrity images breaking | Phase 1: Data modeling + asset pipeline | Verify `public/images/` directory contains all celebrity images before writing any card component |
| Reveal animation timing | Phase 3: Reveal sequence | Schedule a dedicated review session for the reveal — not just "does it work" but "does it feel like an event" |
| Performance: too many concurrent animations | Phase 2 / Phase 3: Optimization | Profile on mid-range Android device (not M-series Mac) using Chrome DevTools Performance panel |
| `prefers-reduced-motion` not respected | Phase 3: Polish + accessibility | Test with macOS Reduce Motion enabled before shipping |
| Share button broken | Phase 4: Post-reveal screen | Click the share button on a real device and verify it opens the Twitter intent URL with correct text |

---

## Sources

- [React Router 7 SPA mode documentation](https://reactrouter.com/how-to/spa) — HIGH confidence
- [React Router 7 pre-rendering documentation](https://reactrouter.com/how-to/pre-rendering) — HIGH confidence
- [Cloudflare Pages serving pages / SPA routing](https://developers.cloudflare.com/pages/configuration/serving-pages/) — HIGH confidence
- [Cloudflare Pages SPA routing setup — Codemzy](https://www.codemzy.com/blog/cloudflare-reactjs-spa-routing) — MEDIUM confidence
- [React Router 7 + Cloudflare Pages deployment issues discussion](https://github.com/remix-run/react-router/discussions/12998) — HIGH confidence (active community reports)
- [AnimatePresence common bug — JS Decoded](https://medium.com/javascript-decoded-in-plain-english/understanding-animatepresence-in-framer-motion-attributes-usage-and-a-common-bug-914538b9f1d3) — HIGH confidence
- [AnimatePresence documentation — motion.dev](https://motion.dev/docs/react-animate-presence) — HIGH confidence
- [Framer Motion reduce bundle size — motion.dev](https://motion.dev/docs/react-reduce-bundle-size) — HIGH confidence
- [Passive event listeners and scroll conflict — xjavascript.com](https://www.xjavascript.com/blog/added-non-passive-event-listener-to-a-scroll-blocking-touchstart-event/) — MEDIUM confidence
- [Framer Motion swipe actions tutorial — motion.dev](https://motion.dev/tutorials/react-swipe-actions) — HIGH confidence
- [Cyberpunk CSS glitch effect performance — ahmodmusa.com](https://ahmodmusa.com/create-cyberpunk-glitch-effect-css-tutorial/) — MEDIUM confidence
- [Cumulative Layout Shift optimization — web.dev](https://web.dev/articles/optimize-cls) — HIGH confidence
- [prefers-reduced-motion — MDN](https://developer.mozilla.org/en-US/docs/Web/CSS/@media/prefers-reduced-motion) — HIGH confidence
- [Animation on landing pages best practices — LandingPageFlow](https://www.landingpageflow.com/post/best-way-to-use-animation-on-landing-pages) — MEDIUM confidence

---
*Pitfalls research for: Animated interactive card-game landing page (twittercelebrity.com)*
*Researched: 2026-03-15*
