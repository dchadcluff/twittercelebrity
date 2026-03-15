# Feature Research

**Domain:** Interactive card-game / celebrity reveal landing page (cyberpunk aesthetic)
**Researched:** 2026-03-15
**Confidence:** HIGH (core swipe mechanics, reveal patterns); MEDIUM (cyberpunk-specific web implementations)

---

## Feature Landscape

### Table Stakes (Users Expect These)

Features users assume exist. Missing these = product feels incomplete or broken.

| Feature | Why Expected | Complexity | Notes |
|---------|--------------|------------|-------|
| Card deck grid display | Users must see all celebrities before the game starts — no deck means no stakes | LOW | ~15-20 cards in a masonry or grid layout; profile photo, handle, display name, follower count, bio snippet |
| X button dismiss on every card | Any card-swipe UI offers a non-gesture dismiss path — required for mouse users and accessibility | LOW | Must be present even if swipe is the primary gesture; visually prominent |
| Swipe-to-dismiss touch gesture | Tinder-pattern is the canonical expectation for card dismissal on mobile; absence feels broken | MEDIUM | Drag threshold check + off-screen animation + card removal from DOM |
| Drag visual feedback (rotation/tilt) | Users expect cards to tilt during drag — confirms the interaction is working | LOW | CSS transform rotate tied to drag delta; already standard in every Tinder clone |
| Dramatic reveal animation | The entire product promise is this moment — a flat state change would kill the experience | HIGH | Remaining cards fly off, spotlight on @chadcluff, confetti burst; the payoff must feel earned |
| @chadcluff hero treatment post-reveal | Users expect a "you've arrived" screen after the journey — bare-bones state transition is jarring | MEDIUM | Card expands to fill viewport, cyberpunk hero styling, witty tagline |
| Follow CTA on reveal screen | Standard on every profile-reveal / quiz-result page; users expect a next action | LOW | Deep link to twitter.com/chadcluff — no OAuth required |
| Share on X button | Viral loop standard on any personality-quiz-style result page; users expect to share their "result" | LOW | Pre-filled tweet text using Web Intent URL (no API key needed) |
| Replay button | Users who dismiss all cards expect to be able to restart — no replay = dead end | LOW | Reset deck state to initial; replay hint can appear on reveal screen |
| Responsive mobile layout | Majority of traffic will be mobile; a desktop-only experience loses most users | MEDIUM | Touch targets ≥ 44px, card sizing fluid, grid collapses to single column on small screens |
| Consistent cyberpunk visual identity | The aesthetic must be coherent from first card to reveal — half-done theming reads as unfinished | MEDIUM | Dark background, neon accent colors (cyan/magenta/green), consistent font, global CSS design tokens |

---

### Differentiators (Competitive Advantage)

Features that set this experience apart. Not assumed, but high value.

| Feature | Value Proposition | Complexity | Notes |
|---------|-------------------|------------|-------|
| Glitch effects on cards / text | Cyberpunk glitch is the primary visual differentiator vs generic card-swipe UIs | LOW-MEDIUM | Pure CSS `clip-path` + `@keyframes steps()` approach gives 60fps on compositor thread without JS; apply on hover/interaction |
| Staggered card entry animation | Cards deal in on page load, not a static grid — communicates "game starting" and creates anticipation | LOW | Framer Motion `staggerChildren` or CSS animation-delay cascade; ~200ms stagger per card row |
| Neon glow / scanline overlay | Signature cyberpunk UI texture — makes the experience feel designed, not templated | LOW | CSS box-shadow for neon; CSS scanline overlay is a single semi-transparent repeating gradient |
| Card flip / discard physics | Cards spinning or flipping off-screen during dismiss (not just sliding) heightens drama of each dismissal | MEDIUM | GSAP or Framer Motion `AnimatePresence` with custom exit variants; rotation + scale + opacity combo |
| Progress indicator (cards remaining) | Builds suspense — "only 3 cards left" creates mounting anticipation before the reveal | LOW | Simple counter or visual card-stack indicator; high user value for low implementation cost |
| Sound design (optional, user-initiated) | Subtle ambient / interaction sounds massively elevate the cyberpunk atmosphere | MEDIUM | Web Audio API or howler.js; MUST be opt-in (muted by default) to avoid annoying users — autoplay blocked by browsers anyway |
| Spotlight / vignette on reveal | Cinematic lighting effect as @chadcluff card expands — elevates the reveal from animation to event | LOW | CSS radial gradient overlay with animation; pairs with confetti for maximum payoff |
| Celebrity card "stat" hover detail | Showing follower count as a formatted stat (e.g., "48.3M followers") on hover adds authenticity | LOW | Tooltip or card flip-back; data is static, formatting is the only work |
| Share pre-filled with card count | "I dismissed 19 Twitter celebrities and @chadcluff is still the only one I follow" — personalized share text based on how many they dismissed before reveal | LOW | Track dismissed count in component state; inject into Web Intent URL |
| `prefers-reduced-motion` support | Respects accessibility needs and avoids vestibular issues — wraps all keyframe animations in media query | LOW | Industry best practice; especially important given the high animation density of this experience |

---

### Anti-Features (Commonly Requested, Often Problematic)

Features that seem good but create scope creep or undermine the experience.

| Feature | Why Requested | Why Problematic | Alternative |
|---------|---------------|-----------------|-------------|
| Undo last dismiss | Feels "safer" — users want to take back accidental swipes | Undermines the game's tension; adds complex state management (card re-entry animation); Tinder itself doesn't offer free undo for this reason | Instead: make dismiss gesture deliberate (require drag past threshold, not accidental tap); add a subtle "are you sure?" visual cue on first dismiss only |
| Real-time Twitter API data | "Keeps follower counts fresh and accurate" | Requires API keys, costs money in v1, rate limits, adds backend complexity, breaks static site constraint; follower counts are approximate anyway | Static data refreshed by a manual script periodically; staleness is acceptable for entertainment product |
| Twitter/X OAuth login | "Personalization based on who you follow" | Massive complexity, security surface area, OAuth flow kills the frictionless single-page experience; PROJECT.md explicitly defers this | Post-reveal share button is sufficient social integration for v1 |
| Infinite or random card order | "More replayable if cards appear in different order each time" | Randomization hides the intentional pacing; the deck is curated to build to the reveal — randomizing undermines the designed experience | Fixed order with Replay available; replayability comes from sharing, not randomization |
| Political figures in deck | "More recognizable celebrities" | Explicitly excluded per PROJECT.md to keep tone fun and non-controversial; political content invites outrage that distracts from the brand message | Use entertainers, athletes, tech figures; Elon Musk is sufficient tech/culture boundary case |
| User-uploaded card creation | "Let visitors add their own celebrities" | Requires backend, moderation, storage — incompatible with static site; content moderation problem | Static curated deck; personal brand clarity is a feature, not a limitation |
| Analytics dashboard | "Track how many people reach reveal" | Out of scope for v1; Cloudflare Pages provides basic analytics; custom dashboard adds significant complexity | Use Cloudflare Web Analytics (free, no-JS option) for basic funnel visibility |
| Loading skeleton screens | "Better perceived performance" | Overkill for a static site where all assets load once; adds visual noise to what should feel like instant game start | Optimize asset sizes instead; preload hero images; staggered entry animation naturally masks load timing |

---

## Feature Dependencies

```
[Card Deck Display]
    └──requires──> [Celebrity Static Data] (hardcoded JSON/TS)
                       └──required by──> [Profile Photo, Handle, Follower Count, Bio]

[Swipe-to-Dismiss]
    └──requires──> [Card Deck Display]
    └──requires──> [Touch Event Handlers + Drag Delta State]
    └──enhances──> [Drag Tilt Visual Feedback] (same drag state drives both)

[X Button Dismiss]
    └──requires──> [Card Deck Display]
    └──shares logic with──> [Swipe-to-Dismiss] (both call same dismissCard() handler)

[Dramatic Reveal Animation]
    └──requires──> [Card Deck Display] (needs all non-chadcluff cards dismissed)
    └──requires──> [Dismiss Count Tracking] (knows when last non-chadcluff card is gone)
    └──enhances──> [Progress Indicator] (same count used for both)

[@chadcluff Hero Screen]
    └──requires──> [Dramatic Reveal Animation] (triggers hero state)
    └──requires──> [Follow CTA]
    └──requires──> [Share on X Button]
    └──requires──> [Replay Button]

[Share on X Button]
    └──enhances with──> [Dismiss Count Tracking] (personalizes tweet text)
    └──independent of──> [OAuth] (uses Web Intent URL, no auth needed)

[Glitch Effects]
    └──requires──> [Cyberpunk Design Tokens] (colors, fonts must be set first)
    └──enhances──> [Card Deck Display] and [@chadcluff Hero Screen]

[prefers-reduced-motion]
    └──wraps──> [Glitch Effects], [Swipe-to-Dismiss animations], [Reveal Animation], [Staggered Entry]
```

### Dependency Notes

- **Dramatic Reveal requires Dismiss Count Tracking:** The reveal fires when `dismissedCount === totalCards - 1`. This single state value also drives the progress indicator and the personalized share text — build it once, use it three times.
- **Swipe-to-Dismiss and X Button share one handler:** Both input methods should call an identical `dismissCard(id)` function. Don't branch the logic — identical outcomes, different input paths.
- **Glitch Effects require design tokens first:** If you build glitch CSS before establishing the color system, you'll refactor the values. Design tokens (CSS custom properties) must be established in Phase 1 before any visual component work.
- **Share on X enhances with Dismiss Count:** The share text becomes more personal ("I dismissed 19 celebrities...") using the already-tracked count. Zero extra state — just string interpolation.

---

## MVP Definition

### Launch With (v1)

Minimum viable product — what's needed to validate the concept.

- [ ] Celebrity static data (JSON/TS) — 15-20 curated entries with photo URL, handle, display name, bio snippet, follower count
- [ ] Card deck grid display — all celebrities visible, cyberpunk styled
- [ ] X button dismiss — works on desktop and mobile
- [ ] Swipe-to-dismiss gesture — works on touch devices with drag threshold and tilt feedback
- [ ] Dismiss count tracking — single piece of state powering reveal trigger + progress indicator + share text
- [ ] Dramatic reveal animation — cards fly away, confetti, spotlight on @chadcluff
- [ ] @chadcluff hero screen — expands to center with cyberpunk hero treatment, witty tagline
- [ ] Follow CTA — links to twitter.com/chadcluff
- [ ] Share on X button — pre-filled Web Intent tweet with personalized dismiss count
- [ ] Replay button — resets deck state
- [ ] Cyberpunk design system — dark background, neon tokens, consistent font
- [ ] Responsive layout — mobile-first, works on 375px viewport and up
- [ ] `prefers-reduced-motion` support — wraps all animations

### Add After Validation (v1.x)

Features to add once core is working and traffic confirms engagement.

- [ ] Progress indicator (cards remaining counter) — already has the state, add the UI component when it's confirmed users want the suspense cue
- [ ] Glitch effects on card hover and reveal — elevates the aesthetic; add after the base experience is confirmed stable
- [ ] Staggered card entry animation — polish pass; add after core interactions are solid
- [ ] Sound design (opt-in) — highest effort-to-reward ratio of post-v1 features; add if the experience feels flat without it

### Future Consideration (v2+)

Features to defer until product-market fit is established.

- [ ] Twitter OAuth login + personalized deck (who you follow) — explicitly deferred in PROJECT.md; adds significant complexity
- [ ] OG image generation for share cards — rich previews when users share the link; requires edge function or static pre-generation
- [ ] Multiple deck themes (e.g., musicians-only, athletes-only) — adds replayability; requires content curation effort
- [ ] Leaderboard / social proof counter ("X people have dismissed the deck today") — needs a backend counter; out of scope for static site

---

## Feature Prioritization Matrix

| Feature | User Value | Implementation Cost | Priority |
|---------|------------|---------------------|----------|
| Card deck grid display | HIGH | LOW | P1 |
| X button dismiss | HIGH | LOW | P1 |
| Swipe-to-dismiss gesture | HIGH | MEDIUM | P1 |
| Drag tilt visual feedback | HIGH | LOW | P1 |
| Dramatic reveal animation | HIGH | HIGH | P1 |
| @chadcluff hero screen | HIGH | MEDIUM | P1 |
| Follow CTA | HIGH | LOW | P1 |
| Share on X button | HIGH | LOW | P1 |
| Replay button | HIGH | LOW | P1 |
| Responsive mobile layout | HIGH | MEDIUM | P1 |
| Cyberpunk design system | HIGH | MEDIUM | P1 |
| `prefers-reduced-motion` | MEDIUM | LOW | P1 (correctness) |
| Dismiss count tracking | HIGH | LOW | P1 (enables P2 features) |
| Progress indicator | MEDIUM | LOW | P2 |
| Glitch effects | MEDIUM | LOW | P2 |
| Staggered entry animation | MEDIUM | LOW | P2 |
| Celebrity stat hover detail | LOW | LOW | P2 |
| Sound design (opt-in) | MEDIUM | MEDIUM | P2 |
| Spotlight / vignette on reveal | MEDIUM | LOW | P2 |
| Twitter OAuth + personalization | HIGH | HIGH | P3 |
| OG image for share cards | MEDIUM | MEDIUM | P3 |
| Multiple deck themes | MEDIUM | HIGH | P3 |

**Priority key:**
- P1: Must have for launch
- P2: Should have, add when possible
- P3: Nice to have, future consideration

---

## Competitor Feature Analysis

The closest analogs are not direct competitors but adjacent product types that inform expectations.

| Feature | Personality Quiz (BuzzFeed/Interact) | Tinder-Clone Card UIs | Our Approach |
|---------|--------------------------------------|-----------------------|--------------|
| Card reveal mechanic | Linear questions, single result | Continuous swipe, no final reveal | One-direction dismissal building to a single dramatic reveal — not a loop |
| Share result | Always present; personalized copy | Absent (matching is private) | Pre-filled tweet with personalized dismiss count; no login required |
| Replay | Always present | Not applicable (ongoing) | Yes, reset to full deck state |
| Undo | Often present | Paid feature (Tinder Gold) | Deliberately excluded — see Anti-Features |
| Visual identity | Generic / branded to quiz tool | Flat, functional | Full cyberpunk art direction; this IS the product |
| Progress feedback | Question N of X | None standard | Optional counter showing cards remaining |
| CTA after result | Lead gen / product recommendation | Match chat | Follow on Twitter/X — single, clear action |
| Sound | None standard | None standard | Optional ambient soundscape; differentiator |
| Mobile-first | Yes | Yes | Yes — majority of traffic is mobile |

---

## Sources

- Tinder swipe card UX pattern: https://dev.to/lansolo99/a-tinder-like-card-game-with-framer-motion-35i5
- CSS glitch effect implementation (CSS-only, compositor-thread safe): https://ahmodmusa.com/create-cyberpunk-glitch-effect-css-tutorial/ and https://www.sitepoint.com/recreate-the-cyberpunk-2077-button-glitch-effect-in-css/
- Cyberpunk design trends 2026: https://www.aproposh.com/2026/03/03/embracing-the-future/
- Confetti + reveal animation with Framer Motion: https://www.yeti.co/lab-case-studies/framer-motion-confetti-effects
- GSAP vs Framer Motion for complex animation: https://semaphore.io/blog/react-framer-motion-gsap
- Swipe gesture accessibility (screen reader conflict): https://www.linkedin.com/pulse/why-implementing-swipe-gestures-causes-mobile-issue-jennison-asuncion
- Quiz result page CTA patterns: https://www.visualquizbuilder.com/post/quiz-result-page-design
- Viral share loop patterns: https://viral-loops.com/viral-loops
- `prefers-reduced-motion` for glitch animations: https://www.hersimu.com/2025/05/27/cyberpunk-aesthetics/
- Twitter Web Intent URL (no API key): https://developer.x.com/en/docs/x-for-websites/cards/overview/abouts-cards

---
*Feature research for: interactive cyberpunk card-game celebrity reveal landing page*
*Researched: 2026-03-15*
