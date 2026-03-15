# Twitter Celebrity

## What This Is

An interactive card-game experience at twittercelebrity.com where visitors see a deck of ~15-20 celebrity Twitter/X cards and dismiss them one by one — only to discover that @chadcluff is the one true Twitter Celebrity. Cyberpunk aesthetic with dramatic animations. Built as a static site on Cloudflare Pages using React Router 7.

## Core Value

The reveal moment — when all other celebrities are dismissed and @chadcluff dramatically takes center stage — must feel like an event. Everything else serves that payoff.

## Requirements

### Validated

(None yet — ship to validate)

### Active

- [ ] Card deck displaying ~15-20 celebrity Twitter/X profiles in a grid/masonry layout
- [ ] Each card shows profile photo, @handle, display name, bio snippet, and follower count
- [ ] Users can dismiss cards via X button tap or swipe-to-dismiss gesture
- [ ] Celebrity mix includes Elon Musk, entertainers (actors, musicians, comedians), and athletes — no political figures
- [ ] When all non-chadcluff cards are dismissed, dramatic reveal animation plays (cards fly away, spotlight, confetti)
- [ ] @chadcluff card grows into center stage with a cyberpunk-styled hero treatment
- [ ] Post-reveal screen shows: Follow @chadcluff CTA, witty bio/tagline, share-on-X button, replay button
- [ ] Cyberpunk visual design: dark background, bold neon colors, glitch effects, high energy
- [ ] Deployed to twittercelebrity.com via Cloudflare Pages
- [ ] Celebrity data is hardcoded with a refresh script to update periodically
- [ ] Responsive design — works on mobile and desktop
- [ ] Swipe gestures work on touch devices, X button works everywhere

### Out of Scope

- Personalization based on visitor's Twitter account — nice to have for future, not v1
- OAuth / Twitter login — complexity doesn't justify v1 value
- Real-time Twitter API calls from the client — static data is sufficient
- Backend server — this is a static site on Cloudflare Pages free tier
- Political figures in the celebrity deck — explicitly excluded per vision

## Context

- Domain: twittercelebrity.com, registered on Cloudflare
- Hosting: Cloudflare Pages free tier (static site)
- Owner: @chadcluff on Twitter/X, known as "a Twitter Celebrity"
- The site is a personal brand / entertainment piece — tone should be fun, confident, slightly tongue-in-cheek
- Celebrity data (photos, bios, follower counts) will be curated manually and stored as static data, with a script to refresh periodically
- The existing codebase is just GSD tooling — the app itself is greenfield

## Constraints

- **Hosting**: Cloudflare Pages free tier — static site only, no server-side rendering at request time
- **Framework**: React Router 7 (per user request)
- **Cost**: No paid APIs in v1 — celebrity data is static/hardcoded
- **Content**: No political figures in the celebrity deck
- **Domain**: Must deploy to twittercelebrity.com via Cloudflare

## Key Decisions

| Decision | Rationale | Outcome |
|----------|-----------|---------|
| React Router 7 | User preference, modern React framework with SSG support | — Pending |
| Cloudflare Pages | Free hosting, domain already on Cloudflare | — Pending |
| Static celebrity data | Avoids API costs and rate limits for v1 | — Pending |
| Cyberpunk aesthetic | User preference — bold, high-energy, dark + neon | — Pending |
| No political figures | Keep it fun and non-controversial | — Pending |
| Personalization deferred | Nice to have but adds significant complexity | — Pending |

---
*Last updated: 2026-03-15 after initialization*
