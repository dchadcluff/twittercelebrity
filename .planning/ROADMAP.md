# Roadmap: Twitter Celebrity

## Overview

A greenfield static SPA delivering a cyberpunk card-game reveal experience. The build order is dictated by dependency: infrastructure and static data must exist before any component can reference it, the card dismissal mechanic must be stable before the reveal can be choreographed, and visual polish is layered on last when the core experience is confirmed. Four phases, each closing with a verifiable capability — the final phase ships the site to twittercelebrity.com.

## Phases

**Phase Numbering:**
- Integer phases (1, 2, 3): Planned milestone work
- Decimal phases (2.1, 2.2): Urgent insertions (marked with INSERTED)

Decimal phases appear between their surrounding integers in numeric order.

- [x] **Phase 1: Foundation** - Deploy a working skeleton to Cloudflare Pages and establish static celebrity data with local images and cyberpunk design tokens
- [ ] **Phase 2: Card Game Mechanics** - Fully playable card-dismissal game with swipe/tap gestures, animations, and responsive cyberpunk card UI
- [ ] **Phase 3: Reveal and Post-Reveal** - Dramatic three-act reveal animation, @chadcluff hero screen, and all post-reveal CTAs
- [ ] **Phase 4: Polish and Launch** - CSS glitch effects, staggered entry animation, and final launch validation at twittercelebrity.com

## Phase Details

### Phase 1: Foundation
**Goal**: A deployed skeleton at twittercelebrity.com with all static celebrity data, local images, and cyberpunk design tokens in place — every subsequent component builds on this without blocked dependencies
**Depends on**: Nothing (first phase)
**Requirements**: INFR-01, INFR-02, INFR-03, CARD-07, CARD-08, DESG-01
**Success Criteria** (what must be TRUE):
  1. Visiting twittercelebrity.com loads the React Router 7 app without a 404 or blank screen
  2. Direct URL access (e.g. twittercelebrity.com/anything) redirects correctly to the SPA instead of 404-ing
  3. The celebrity data file contains 15-20 entries (Elon Musk, entertainers, athletes — no political figures) with locally hosted profile images that render without broken-image icons
  4. The cyberpunk color tokens (dark background, neon cyan, pink, yellow) are available globally via Tailwind CSS v4 `@theme`
**Plans:** 2/2 plans complete

Plans:
- [x] 01-01-PLAN.md — Scaffold RR7 SPA, create celebrity data with local images, define cyberpunk design tokens, install Vitest validation tests
- [x] 01-02-PLAN.md — Deploy to Cloudflare Pages via GitHub, verify SPA routing on live domain, configure twittercelebrity.com custom domain

### Phase 2: Card Game Mechanics
**Goal**: A fully playable card-dismissal game where users can tap or swipe away all celebrity cards with fluid tactile feedback and cyberpunk card styling on both mobile and desktop
**Depends on**: Phase 1
**Requirements**: CARD-01, CARD-02, CARD-03, CARD-04, CARD-05, CARD-06, DESG-04
**Success Criteria** (what must be TRUE):
  1. On page load, all ~15-20 celebrity cards appear in a grid with profile photo, @handle, display name, bio snippet, and follower count visible
  2. Tapping the X button on any card removes it with an exit animation, and the remaining cards reflow correctly
  3. Swiping a card on a touch device (tested on real iOS or Android) dismisses it; the card tilts during drag providing tactile feedback
  4. Cards animate in with a staggered entry on page load (not all appearing simultaneously)
  5. The layout is usable and visually correct at both 375px mobile width and 1280px desktop width
**Plans:** 2/3 plans executed

Plans:
- [ ] 02-01-PLAN.md — Install framer-motion, create game state reducer with tests, build StickyHeader and InstructionHint components
- [ ] 02-02-PLAN.md — Build CelebrityCard and DismissButton with drag/tilt/dismiss mechanics and exit animations
- [ ] 02-03-PLAN.md — Wire CardGrid with AnimatePresence, integrate all components in home.tsx, visual checkpoint

### Phase 3: Reveal and Post-Reveal
**Goal**: The emotional payoff — when the last celebrity card is dismissed, a cinematic three-act sequence plays and @chadcluff takes center stage with a hero screen offering Follow, Share, and Replay actions
**Depends on**: Phase 2
**Requirements**: REVL-01, REVL-02, REVL-03, REVL-04, REVL-05, REVL-06, POST-01, POST-02, POST-03, POST-04
**Success Criteria** (what must be TRUE):
  1. Dismissing the last non-chadcluff card triggers the reveal sequence automatically with no manual interaction required
  2. The reveal plays as three distinct acts: remaining cards exit in a staggered animation, a deliberate pause follows, then @chadcluff card grows into center stage with a neon spotlight/glow effect
  3. A confetti burst fires during the reveal (canvas-confetti, visible on both mobile and desktop)
  4. The post-reveal hero screen displays @chadcluff's card with witty bio/tagline, and the Follow CTA links to the correct Twitter/X profile URL
  5. The Share on X button opens a pre-filled tweet via Web Intent, and the Replay button resets the game and shuffles card order
**Plans**: TBD

### Phase 4: Polish and Launch
**Goal**: Cyberpunk glitch effects layered onto the experience and a full launch validation confirming the site is live, correct, and visually complete at twittercelebrity.com
**Depends on**: Phase 3
**Requirements**: DESG-02, DESG-03
**Success Criteria** (what must be TRUE):
  1. CSS glitch effects are visible on key text elements and activate during the reveal sequence
  2. Cards and interactive elements display neon glow box-shadows consistent with the cyberpunk design language
  3. The live site at twittercelebrity.com passes a full playthrough: all cards dismiss, reveal fires correctly, post-reveal screen appears, and Share/Follow/Replay all work
**Plans**: TBD

## Progress

**Execution Order:**
Phases execute in numeric order: 1 → 2 → 3 → 4

| Phase | Plans Complete | Status | Completed |
|-------|----------------|--------|-----------|
| 1. Foundation | 2/2 | Complete    | 2026-03-16 |
| 2. Card Game Mechanics | 2/3 | In Progress|  |
| 3. Reveal and Post-Reveal | 0/TBD | Not started | - |
| 4. Polish and Launch | 0/TBD | Not started | - |
