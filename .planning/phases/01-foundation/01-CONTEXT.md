# Phase 1: Foundation - Context

**Gathered:** 2026-03-15
**Status:** Ready for planning

<domain>
## Phase Boundary

Deploy a working React Router 7 SPA skeleton to Cloudflare Pages at twittercelebrity.com, establish static celebrity data with locally hosted images, and define cyberpunk design tokens. Every subsequent phase builds on this foundation — nothing else can start until the skeleton deploys and data exists.

</domain>

<decisions>
## Implementation Decisions

### Deploy workflow
- Git integration: Connect GitHub repo to Cloudflare Pages for auto-deploy on push
- GitHub repo: `github.com/dchadcluff/twittercelebrity` (new repo, needs to be created)
- Plan should include full walkthrough: create GitHub repo, connect to Cloudflare Pages, configure custom domain twittercelebrity.com
- Build output: `build/client/` directory (React Router 7 SPA mode)
- SPA routing: `public/_redirects` file with `/* /index.html 200`
- React Router 7 config: `ssr: false` in `react-router.config.ts`
- Do NOT use `@react-router/cloudflare` Vite plugin for static SPA deploy (known conflict — see STATE.md blockers)

### Celebrity roster
- 15 total cards: 14 celebrities + @chadcluff
- Must include Elon Musk, no political figures
- Mix of entertainers and athletes with absurd contrast — wildly different people for comedic effect, making the @chadcluff reveal funnier
- Claude picks the specific 14 celebrities (user said "suggest for me")
- Cards randomized on every page load — fresh experience each visit
- @chadcluff is always the last remaining card (cannot be dismissed until all others are gone)

### Card data shape
- Claude's discretion on exact TypeScript type shape and image dimensions
- Research should inform: optimal profile image size for cards, data fields needed

### Cyberpunk palette
- Claude's discretion on exact hex values and font choices
- Requirements: dark background, neon cyan, pink, yellow accents
- Tailwind CSS v4 `@theme` directive for design tokens

### Claude's Discretion
- Exact cyberpunk color hex values, font selection, and Tailwind token naming
- Card data TypeScript type structure and field names
- Celebrity image dimensions and format (JPEG vs WebP)
- Specific 14 celebrity picks (absurd contrast mix of entertainers + athletes + Elon)
- Project scaffolding structure (file layout, component organization)

</decisions>

<canonical_refs>
## Canonical References

**Downstream agents MUST read these before planning or implementing.**

### Stack and deployment
- `.planning/research/STACK.md` — React Router 7 SPA mode config, Cloudflare Pages deployment commands, Tailwind v4 setup, Vite plugin caveats
- `.planning/research/PITFALLS.md` — SPA routing misconfiguration on CF Pages (deploy skeleton day 1), Twitter CDN image instability (download locally)

### Architecture
- `.planning/research/ARCHITECTURE.md` — Phase-driven state machine, component boundaries, data flow, build order

### Features and design
- `.planning/research/FEATURES.md` — Table stakes features, animation patterns, accessibility requirements
- `.planning/research/SUMMARY.md` — Synthesized research findings and roadmap implications

</canonical_refs>

<code_context>
## Existing Code Insights

### Reusable Assets
- None — this is a greenfield project. No app code exists yet, only GSD framework tooling in `.claude/`.

### Established Patterns
- None — patterns will be established by this phase.

### Integration Points
- `.claude/` directory contains GSD tooling (not app code — leave untouched)
- App code will live at project root alongside `.claude/` and `.planning/`

</code_context>

<specifics>
## Specific Ideas

- Celebrity mix should create absurd contrast for comedic effect — think The Rock next to a classical musician next to a K-pop star next to Elon Musk
- The @chadcluff card is special — it can never be dismissed, it's always the last one standing
- Deploy must be verified working on day 1 before any feature code is written (risk mitigation per research)

</specifics>

<deferred>
## Deferred Ideas

None — discussion stayed within phase scope

</deferred>

---

*Phase: 01-foundation*
*Context gathered: 2026-03-15*
