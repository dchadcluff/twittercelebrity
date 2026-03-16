# Requirements: Twitter Celebrity

**Defined:** 2026-03-15
**Core Value:** The reveal moment — when all other celebrities are dismissed and @chadcluff dramatically takes center stage — must feel like an event.

## v1 Requirements

Requirements for initial release. Each maps to roadmap phases.

### Card Game

- [x] **CARD-01**: User sees a grid of ~15-20 celebrity cards on page load
- [x] **CARD-02**: Each card displays profile photo, @handle, display name, bio snippet, and follower count
- [x] **CARD-03**: User can dismiss a card by tapping the X button in the corner
- [x] **CARD-04**: User can dismiss a card by swiping it away on touch devices
- [x] **CARD-05**: Cards tilt during swipe drag for tactile feedback
- [x] **CARD-06**: Cards animate in with staggered entry on page load
- [x] **CARD-07**: Celebrity mix includes Elon Musk, entertainers, and athletes — no political figures
- [x] **CARD-08**: Celebrity data is hardcoded with local images (not CDN hotlinks)

### Reveal

- [x] **REVL-01**: When all non-chadcluff cards are dismissed, dramatic reveal sequence begins
- [x] **REVL-02**: Remaining cards fly away in staggered exit animation
- [x] **REVL-03**: Deliberate pause between card exits and @chadcluff entrance
- [x] **REVL-04**: @chadcluff card grows into center stage with hero treatment
- [x] **REVL-05**: Confetti burst fires during reveal via canvas-confetti
- [x] **REVL-06**: Neon spotlight/glow effect highlights the hero card

### Post-Reveal

- [x] **POST-01**: Follow @chadcluff CTA button links to Twitter/X profile
- [x] **POST-02**: Share on X button generates pre-filled tweet via Web Intent
- [x] **POST-03**: Replay button resets game and shuffles card order
- [x] **POST-04**: Witty bio/tagline section displays on the hero screen

### Visual Design

- [x] **DESG-01**: Cyberpunk dark theme with neon color palette (cyan, pink, yellow)
- [x] **DESG-02**: CSS glitch effects on text and key elements
- [x] **DESG-03**: Neon glow box-shadows on cards and interactive elements
- [x] **DESG-04**: Responsive layout works on mobile and desktop

### Infrastructure

- [x] **INFR-01**: React Router 7 SPA deployed to Cloudflare Pages
- [x] **INFR-02**: SPA routing works on direct URL access (/_redirects configured)
- [x] **INFR-03**: Site serves at twittercelebrity.com

## v2 Requirements

Deferred to future release. Tracked but not in current roadmap.

### Personalization

- **PERS-01**: Detect visitor's Twitter/X identity via cookies or OAuth
- **PERS-02**: Include people the visitor follows in the celebrity deck
- **PERS-03**: Mention visitor by name during or after the reveal

### Audio

- **AUDX-01**: Sound effects during card dismiss
- **AUDX-02**: Dramatic audio cue during reveal sequence
- **AUDX-03**: Background ambient audio

### Accessibility

- **ACCS-01**: prefers-reduced-motion disables or simplifies all animations
- **ACCS-02**: Screen reader announces card dismiss and reveal events

### Data

- **DATA-01**: Automated script to refresh celebrity data periodically
- **DATA-02**: CI pipeline to rebuild and deploy after data refresh

## Out of Scope

| Feature | Reason |
|---------|--------|
| Twitter/X OAuth login | Complexity doesn't justify v1 value |
| Real-time Twitter API calls | Static data sufficient; avoids costs and rate limits |
| Backend server | Cloudflare Pages free tier is static only |
| Political figures in deck | Keep it fun and non-controversial |
| Mobile native app | Web-first, static site |
| Real-time multiplayer | Single-player experience |
| User accounts / persistence | No backend, no need |

## Traceability

Which phases cover which requirements. Updated during roadmap creation.

| Requirement | Phase | Status |
|-------------|-------|--------|
| CARD-01 | Phase 2 | Complete |
| CARD-02 | Phase 2 | Complete |
| CARD-03 | Phase 2 | Complete |
| CARD-04 | Phase 2 | Complete |
| CARD-05 | Phase 2 | Complete |
| CARD-06 | Phase 2 | Complete |
| CARD-07 | Phase 1 | Complete |
| CARD-08 | Phase 1 | Complete |
| REVL-01 | Phase 3 | Complete |
| REVL-02 | Phase 3 | Complete |
| REVL-03 | Phase 3 | Complete |
| REVL-04 | Phase 3 | Complete |
| REVL-05 | Phase 3 | Complete |
| REVL-06 | Phase 3 | Complete |
| POST-01 | Phase 3 | Complete |
| POST-02 | Phase 3 | Complete |
| POST-03 | Phase 3 | Complete |
| POST-04 | Phase 3 | Complete |
| DESG-01 | Phase 1 | Complete |
| DESG-02 | Phase 4 | Complete |
| DESG-03 | Phase 4 | Complete |
| DESG-04 | Phase 2 | Complete |
| INFR-01 | Phase 1 | Complete |
| INFR-02 | Phase 1 | Complete |
| INFR-03 | Phase 1 | Complete |

**Coverage:**
- v1 requirements: 25 total
- Mapped to phases: 25
- Unmapped: 0 ✓

---
*Requirements defined: 2026-03-15*
*Last updated: 2026-03-16 after Plan 01-02 complete (INFR-01, INFR-02, INFR-03 complete)*
