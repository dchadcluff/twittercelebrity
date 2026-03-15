# Phase 1: Foundation - Research

**Researched:** 2026-03-15
**Domain:** React Router 7 SPA deployment to Cloudflare Pages, static celebrity data, Tailwind CSS v4 cyberpunk design tokens
**Confidence:** HIGH (all core findings verified via project's own prior research + official docs)

---

<user_constraints>
## User Constraints (from CONTEXT.md)

### Locked Decisions

- **Deploy workflow:** Git integration — connect GitHub repo to Cloudflare Pages for auto-deploy on push
- **GitHub repo:** `github.com/dchadcluff/twittercelebrity` (new repo, needs to be created)
- **Full walkthrough required:** Plan must include creating GitHub repo, connecting to Cloudflare Pages, configuring custom domain twittercelebrity.com
- **Build output:** `build/client/` directory (React Router 7 SPA mode)
- **SPA routing:** `public/_redirects` file with `/* /index.html 200`
- **React Router 7 config:** `ssr: false` in `react-router.config.ts`
- **Do NOT use `@react-router/cloudflare` Vite plugin** for static SPA deploy (known conflict — GitHub Discussion #12998)
- **Celebrity roster:** 15 total cards: 14 celebrities + @chadcluff
- **Must include Elon Musk, no political figures**
- **Mix of entertainers and athletes** with absurd contrast for comedic effect
- **Claude picks the 14 celebrities** (user delegated this)
- **Cards randomized on every page load**
- **@chadcluff is always the last remaining card** (cannot be dismissed until all others are gone)
- **Tailwind CSS v4 `@theme` directive** for design tokens

### Claude's Discretion

- Exact cyberpunk color hex values, font selection, and Tailwind token naming
- Card data TypeScript type structure and field names
- Celebrity image dimensions and format (JPEG vs WebP)
- Specific 14 celebrity picks (absurd contrast mix of entertainers + athletes + Elon)
- Project scaffolding structure (file layout, component organization)

### Deferred Ideas (OUT OF SCOPE)

None — discussion stayed within phase scope.

</user_constraints>

---

<phase_requirements>
## Phase Requirements

| ID | Description | Research Support |
|----|-------------|-----------------|
| INFR-01 | React Router 7 SPA deployed to Cloudflare Pages | `ssr: false` config + Cloudflare Pages build settings documented in STACK.md; scaffold command identified |
| INFR-02 | SPA routing works on direct URL access (`/_redirects` configured) | `_redirects` file pattern fully documented; 404.html warning documented in PITFALLS.md |
| INFR-03 | Site serves at twittercelebrity.com | Cloudflare Pages custom domain workflow identified; DNS propagation timing noted |
| CARD-07 | Celebrity mix includes Elon Musk, entertainers, and athletes — no political figures | Celebrity roster design documented; 14 picks to be made by Claude during implementation |
| CARD-08 | Celebrity data is hardcoded with local images (not CDN hotlinks) | Static data file pattern (`src/data/celebrities.ts`) + `public/images/celebrities/` path defined; Twitter CDN instability pitfall documented |
| DESG-01 | Cyberpunk dark theme with neon color palette (cyan, pink, yellow) | Tailwind v4 `@theme` directive pattern documented; specific token recommendations in Code Examples below |

</phase_requirements>

---

## Summary

Phase 1 is a greenfield setup task with three concrete deliverables: (1) a working React Router 7 SPA scaffolded and deployed to Cloudflare Pages at twittercelebrity.com, (2) a static celebrity data file with 15 entries and locally hosted profile images, and (3) Tailwind CSS v4 cyberpunk design tokens available globally. All subsequent phases depend on this foundation — nothing else can start until the skeleton is deployed and verified.

The technical work is well-understood. The stack (React Router 7 + Tailwind v4 + Cloudflare Pages) is documented in prior project research with verified commands and configurations. The single highest-risk item is the SPA routing configuration — `ssr: false` in `react-router.config.ts` plus a `_redirects` file in `public/`. Failure here means every non-root URL 404s. This must be validated by deploying the skeleton to the real Cloudflare domain on day one, not just confirming it works locally.

The celebrity data and image hosting are straightforward. Profile images must be downloaded and committed to `public/images/celebrities/` — linking directly to `pbs.twimg.com` CDN URLs will result in broken images within weeks. The design tokens section is pure CSS configuration with no risk — the main decision is which hex values and token names to use.

**Primary recommendation:** Scaffold the project, configure `ssr: false` and `_redirects`, deploy a skeleton to Cloudflare Pages, verify direct URL access works, then add celebrity data and design tokens.

---

## Standard Stack

### Core

| Library | Version | Purpose | Why Standard |
|---------|---------|---------|--------------|
| React Router 7 | 7.13.1 | SPA framework, routing | Mandated by project. `ssr: false` mode produces static bundle; typed routes, loaders, excellent Vite DX |
| React | 19.x | UI rendering | Required by React Router 7. React 19 concurrent features improve layout animations |
| TypeScript | 5.9.x | Type safety | RR7 generates typed route modules; `loaderData` type inference is free — skip TS and lose it |
| Vite | 8.x | Build tool | RR7's compiler is built on Vite 8 (Rolldown bundler, 30x faster builds); scaffolding installs it automatically |
| Tailwind CSS | 4.2.x | Utility-first CSS | v4 CSS-first config, zero content detection needed, 100x faster incremental builds; `@theme` directive is the required token API |

### Supporting (Phase 1 only — others deferred)

| Library | Version | Purpose | When to Use |
|---------|---------|---------|-------------|
| @react-router/dev | latest | CLI, build, type generation | Dev dependency. Provides `react-router build` outputting to `build/client/` |
| @tailwindcss/vite | 4.x | Vite plugin for Tailwind v4 | Required in Phase 1 — v4 uses a Vite plugin, NOT the PostCSS approach used in v3 |

### NOT in Phase 1 (deferred to later phases)

| Library | Deferred To | Reason |
|---------|-------------|--------|
| framer-motion | Phase 2 | Card animations not needed in skeleton |
| canvas-confetti | Phase 3 | Reveal sequence not implemented until Phase 3 |
| @react-router/cloudflare | Never (for this deployment) | Known SPA mode conflict — do NOT install; see CONTEXT.md blocker |

### Installation

```bash
# Scaffold with Cloudflare template (recommended — wires up CF tooling)
npx create-react-router@latest twittercelebrity --template remix-run/react-router-templates/cloudflare

# After scaffolding, add Tailwind CSS v4
npm install -D tailwindcss @tailwindcss/vite
```

**CRITICAL:** The Cloudflare template installs `@react-router/cloudflare` by default. After scaffolding, remove it from `vite.config.ts` — do not use `cloudflareDevProxyVitePlugin` for this static SPA deployment (known SPA mode conflict per GitHub Discussion #12998).

---

## Architecture Patterns

### Recommended Project Structure

```
twittercelebrity/           # Project root
├── app/
│   ├── routes/
│   │   └── home.tsx        # Single route — entire experience lives here
│   ├── data/
│   │   ├── celebrities.ts  # 14 celebrity CelebrityCard objects
│   │   └── chadcluff.ts    # @chadcluff hero card data (separate for clarity)
│   ├── state/
│   │   └── types.ts        # CelebrityCard type, AppState, AppAction types
│   ├── styles/
│   │   └── app.css         # @import "tailwindcss"; @theme { ... } tokens
│   ├── root.tsx            # RR7 root with HydrateFallback (required for SPA mode)
│   └── entry.client.tsx    # Client hydration entry
├── public/
│   ├── images/
│   │   └── celebrities/    # Downloaded profile photos (.jpg or .webp)
│   └── _redirects          # /* /index.html 200
├── react-router.config.ts  # ssr: false
├── vite.config.ts          # @tailwindcss/vite plugin (NOT cloudflare plugin)
└── tsconfig.json
```

**Note:** Framer Motion `scenes/`, `hooks/`, and `components/` directories belong in Phase 2 and later. Phase 1 only needs `data/`, `styles/`, and the root route skeleton.

### Pattern 1: SPA Mode Configuration

**What:** `react-router.config.ts` with `ssr: false` tells the build to output a single `index.html` + assets with no server runtime. This is the non-negotiable configuration for static Cloudflare Pages deployment.

**When to use:** Any React Router 7 app deployed to a static file host (Cloudflare Pages, S3, Netlify, etc.).

**Example:**
```typescript
// react-router.config.ts
import type { Config } from "@react-router/dev/config";

export default {
  ssr: false,
} satisfies Config;
```

### Pattern 2: SPA Routing Fallback on Cloudflare Pages

**What:** A `_redirects` file in `public/` tells Cloudflare Pages to serve `index.html` for every URL path. Without this, direct URL access to any non-root path returns a Cloudflare 404.

**When to use:** Every SPA deployed to Cloudflare Pages.

**Example:**
```
# public/_redirects
/* /index.html 200
```

**Critical detail:** Do NOT include a `404.html` in the build output — its presence disables Cloudflare's SPA routing fallback behavior. Verify the `build/client/` directory does not contain `404.html` after running `npm run build`.

### Pattern 3: HydrateFallback in Root Route

**What:** React Router 7 SPA mode requires a `HydrateFallback` export in `root.tsx`. Without it, the app crashes on first load in SPA mode.

**When to use:** Required — always present in RR7 SPA mode.

**Example:**
```typescript
// app/root.tsx
import { Outlet } from "react-router";

export function HydrateFallback() {
  return <div>Loading...</div>;  // Shown during JS bundle load
}

export default function Root() {
  return <Outlet />;
}
```

### Pattern 4: Tailwind v4 CSS-First Token Definition

**What:** Tailwind v4 uses a `@theme` directive in CSS instead of a `tailwind.config.js` file. Design tokens are CSS custom properties defined once in `app.css` and available globally as Tailwind utilities.

**When to use:** Phase 1 — define tokens before any UI components are built.

**Example:**
```css
/* app/styles/app.css */
@import "tailwindcss";

@theme {
  /* Dark backgrounds */
  --color-cyber-black: #0a0a0f;
  --color-cyber-dark: #12121a;
  --color-cyber-panel: #1a1a2e;

  /* Neon accents */
  --color-neon-cyan: #00f5ff;
  --color-neon-pink: #ff006e;
  --color-neon-yellow: #f5e642;
  --color-neon-purple: #bf00ff;

  /* Typography */
  --font-cyber: "Rajdhani", "Orbitron", monospace;
}
```

Tokens become Tailwind utilities automatically: `bg-cyber-black`, `text-neon-cyan`, `border-neon-pink`, etc.

### Pattern 5: CelebrityCard TypeScript Type

**What:** Defines the data shape for all 15 cards (14 celebrities + @chadcluff). Used throughout all subsequent phases — establish it in Phase 1.

**Recommended shape:**
```typescript
// app/state/types.ts
export interface CelebrityCard {
  id: string;              // Stable ID — used as React key; never change
  handle: string;          // e.g., "@elonmusk"
  displayName: string;     // e.g., "Elon Musk"
  bio: string;             // Short snippet (~100 chars)
  followerCount: string;   // Formatted string: "172.4M" (pre-format — no runtime math)
  photoPath: string;       // Local path: "/images/celebrities/elon-musk.jpg"
  isChad: boolean;         // true for @chadcluff only — gates special behavior
}
```

**Why `followerCount` as string:** Pre-formatting avoids runtime number formatting complexity. Values like "48.3M" are static data — format once at data-authoring time.

**Why `isChad` flag:** Simpler than comparing `id === 'chadcluff'` throughout the codebase. Makes the special card behavior explicit and searchable.

### Anti-Patterns to Avoid

- **Do NOT use the `@react-router/cloudflare` Vite plugin in `vite.config.ts`.** The `cloudflareDevProxyVitePlugin` conflicts with SPA mode (`ssr: false`). Remove it from the scaffold template before proceeding.
- **Do NOT link profile photos to `pbs.twimg.com` or any Twitter CDN URL.** These URLs are not stable — they expire or change when users update their avatars. Download and commit all images to `public/images/celebrities/`.
- **Do NOT omit `_redirects` from `public/`.** Cloudflare Pages does NOT auto-detect SPAs unless this file is present. Missing it causes every non-root URL to 404.
- **Do NOT skip `HydrateFallback` in `root.tsx`.** React Router 7 SPA mode requires it. The app will crash without it.

---

## Don't Hand-Roll

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| SPA routing fallback | Custom Cloudflare Worker to rewrite requests | `public/_redirects` file | Built-in CF Pages feature; zero code, zero cost |
| CSS design token system | Inline hex values scattered across components | Tailwind v4 `@theme` directive | Single source of truth; tokens auto-generate utility classes |
| Image hosting at runtime | Fetching from Twitter CDN | Static files in `public/images/` | CDN URLs are unstable; self-hosting is the only reliable approach |
| TypeScript type generation | Manual type definitions for each celebrity | Single `CelebrityCard` interface | Typed once; used everywhere |

**Key insight:** Phase 1's "don't hand-roll" principle is mostly about not reinventing infrastructure. Use Cloudflare Pages' built-in SPA routing, Tailwind's token system, and static file hosting — all built-in, all free.

---

## Common Pitfalls

### Pitfall 1: SPA Routing Fails After Deploy (404 on Direct URL Access)

**What goes wrong:** The home page loads at `/` but any other URL returns a Cloudflare 404 page. This is the most dangerous Phase 1 failure — it looks fine in local dev but breaks in production.

**Why it happens:** Three compounding issues: (1) missing `ssr: false` in `react-router.config.ts`, (2) missing `_redirects` file in `public/`, (3) a `404.html` in build output that disables CF Pages' auto-fallback.

**How to avoid:**
1. `ssr: false` in `react-router.config.ts` — set this first, before anything else
2. `public/_redirects` with `/* /index.html 200` — UTF-8, LF line endings
3. Verify `build/client/` after `npm run build` — confirm no `404.html` exists
4. Deploy the skeleton BEFORE writing any feature code — validate routing works end-to-end on the real domain on day one

**Warning signs:** Home page loads locally; any non-root URL returns CF 404 page after deploy.

### Pitfall 2: Celebrity Profile Images Break at Runtime

**What goes wrong:** Images display correctly in dev (from downloaded files) but later you're tempted to reference `pbs.twimg.com` URLs directly — these break within weeks.

**Why it happens:** Twitter/X profile CDN URLs are not permanent. They rotate when users update avatars, and hotlink protection may block external `<img>` embeds.

**How to avoid:** Download all 14 celebrity profile photos and the @chadcluff photo during Phase 1. Store in `public/images/celebrities/`. Use relative paths in the data file (`/images/celebrities/elon-musk.jpg`). Never reference external CDN URLs.

**Warning signs:** Any `photoPath` value containing `pbs.twimg.com`, `abs.twimg.com`, or other external domains.

### Pitfall 3: Cloudflare Vite Plugin Conflict

**What goes wrong:** Using the `cloudflareDevProxyVitePlugin` from `@react-router/cloudflare` in `vite.config.ts` breaks SPA mode. The build may succeed but runtime behavior is wrong.

**Why it happens:** The Cloudflare template scaffolds the plugin by default. In SPA mode (`ssr: false`), the proxy plugin conflicts with the static build output.

**How to avoid:** After scaffolding with the Cloudflare template, immediately remove `cloudflareDevProxyVitePlugin` from `vite.config.ts`. Do NOT install or import from `@react-router/cloudflare` at all for this static deployment.

**Warning signs:** `vite.config.ts` imports from `@react-router/cloudflare`.

### Pitfall 4: Tailwind v3 Setup Applied to v4

**What goes wrong:** Following a Tailwind v3 tutorial — creating `tailwind.config.js`, using `npx tailwindcss init`, adding PostCSS config — produces a broken or ineffective setup with v4.

**Why it happens:** Tailwind v4 is architecturally different from v3. It uses a Vite plugin (`@tailwindcss/vite`) instead of PostCSS, and a `@theme` CSS directive instead of a JS config file. The old approach doesn't work.

**How to avoid:**
- Install `@tailwindcss/vite` (not `tailwindcss` PostCSS plugin)
- Add the Vite plugin in `vite.config.ts`: `import tailwindcss from '@tailwindcss/vite'`
- Use `@import "tailwindcss";` + `@theme { ... }` in CSS — no `tailwind.config.js` needed
- Do NOT run `npx tailwindcss init`

**Warning signs:** A `tailwind.config.js` file exists in the project root; `postcss.config.js` references tailwindcss.

### Pitfall 5: Missing `HydrateFallback` in Root Route

**What goes wrong:** The app crashes with a React error on first load in SPA mode.

**Why it happens:** React Router 7 SPA mode requires a `HydrateFallback` export in the root route (`app/root.tsx`). Without it, RR7 has no component to render while the JS bundle loads.

**How to avoid:** Always export `HydrateFallback` from `root.tsx` in SPA mode. The scaffold template may or may not include it — verify it's present.

---

## Code Examples

Verified patterns from official sources and project research:

### react-router.config.ts (SPA Mode)

```typescript
// react-router.config.ts
// Source: https://reactrouter.com/start/framework/rendering
import type { Config } from "@react-router/dev/config";

export default {
  ssr: false,
} satisfies Config;
```

### vite.config.ts (Tailwind v4 + RR7, NO Cloudflare plugin)

```typescript
// vite.config.ts
// Source: STACK.md + Tailwind v4 Vite plugin docs
import { reactRouter } from "@react-router/dev/vite";
import tailwindcss from "@tailwindcss/vite";
import { defineConfig } from "vite";

export default defineConfig({
  plugins: [
    tailwindcss(),   // Tailwind v4 Vite plugin — BEFORE reactRouter
    reactRouter(),   // React Router 7 Vite plugin
    // NOTE: Do NOT add cloudflareDevProxyVitePlugin here
  ],
});
```

### app/root.tsx with HydrateFallback

```typescript
// app/root.tsx
// Source: https://reactrouter.com/how-to/spa
import { Outlet, Meta, Links, ScrollRestoration, Scripts } from "react-router";

export function HydrateFallback() {
  return (
    <html lang="en">
      <head><meta charSet="utf-8" /><meta name="viewport" content="width=device-width, initial-scale=1" /></head>
      <body><div id="loading">Loading...</div></body>
    </html>
  );
}

export default function Root() {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <Meta />
        <Links />
      </head>
      <body>
        <Outlet />
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
}
```

### public/_redirects

```
/* /index.html 200
```

Save as UTF-8, LF line endings. CRLF line endings silently break this file on Cloudflare Pages.

### app/styles/app.css (Tailwind v4 + Cyberpunk Tokens)

```css
/* app/styles/app.css */
/* Source: https://tailwindcss.com/docs/v4-beta */
@import "tailwindcss";

@theme {
  /* Backgrounds */
  --color-cyber-black: #0a0a0f;
  --color-cyber-dark: #12121a;
  --color-cyber-panel: #1a1a2e;
  --color-cyber-surface: #16213e;

  /* Neon accents */
  --color-neon-cyan: #00f5ff;
  --color-neon-cyan-dim: #00b8c4;
  --color-neon-pink: #ff006e;
  --color-neon-pink-dim: #cc0058;
  --color-neon-yellow: #f5e642;
  --color-neon-purple: #bf00ff;

  /* Typography */
  --font-cyber: "Rajdhani", "Orbitron", ui-monospace, monospace;

  /* Base text */
  --color-cyber-text: #e2e8f0;
  --color-cyber-muted: #94a3b8;
}

/* Global base styles */
body {
  background-color: var(--color-cyber-black);
  color: var(--color-cyber-text);
  font-family: var(--font-cyber);
}
```

### app/data/celebrities.ts (Data Shape)

```typescript
// app/data/celebrities.ts
import type { CelebrityCard } from "../state/types";

export const CELEBRITIES: CelebrityCard[] = [
  {
    id: "elon-musk",
    handle: "@elonmusk",
    displayName: "Elon Musk",
    bio: "CEO of Tesla, SpaceX, X. Technoking. Mars or bust.",
    followerCount: "172.4M",
    photoPath: "/images/celebrities/elon-musk.jpg",
    isChad: false,
  },
  // ... 13 more celebrities
];
```

### Celebrity Roster (14 picks — absurd contrast for comedic effect)

Recommended 14 celebrities covering the required absurd contrast (entertainers + athletes + tech + Elon):

| # | Name | Handle | Category | Contrast Note |
|---|------|--------|----------|---------------|
| 1 | Elon Musk | @elonmusk | Tech/Chaos | Required; ~172M followers |
| 2 | The Rock (Dwayne Johnson) | @TheRock | Athlete/Actor | ~97M followers |
| 3 | Taylor Swift | @taylorswift13 | Pop | ~100M followers |
| 4 | LeBron James | @KingJames | NBA | ~52M followers |
| 5 | BTS (Official) | @BTS_twt | K-pop | ~44M followers |
| 6 | Cristiano Ronaldo | @Cristiano | Soccer | ~115M followers |
| 7 | Lady Gaga | @ladygaga | Pop/Alt | ~85M followers |
| 8 | Shaquille O'Neal | @SHAQ | NBA Legend | ~16M followers |
| 9 | Billie Eilish | @billieeilish | Alt Pop | ~56M followers |
| 10 | Kevin Hart | @KevinHart4real | Comedian | ~34M followers |
| 11 | Serena Williams | @serenawilliams | Tennis | ~12M followers |
| 12 | Post Malone | @PostMalone | Rap | ~18M followers |
| 13 | Gordon Ramsay | @GordonRamsay | Celebrity Chef | ~9M followers |
| 14 | Lionel Messi | @TeamMessi | Soccer | ~20M followers |

The juxtaposition of Messi + BTS + Gordon Ramsay + Shaq + Elon in the same card deck delivers the absurd contrast the user requested. No political figures. All entertainment/sports/tech.

### Celebrity Photo Acquisition

Profile photos should be sourced from official Twitter/X profile pages and saved as:
- Format: JPEG (smaller file size than WebP for photos; widely compatible)
- Size: 200x200px square (Twitterprofile standard crop; cards will scale from there)
- Max file size: under 100KB each (15 photos × 100KB = 1.5MB total — acceptable for static asset)
- Path pattern: `public/images/celebrities/{handle-slug}.jpg`

Example: `public/images/celebrities/elon-musk.jpg`, `public/images/celebrities/the-rock.jpg`

Also needed: `public/images/celebrities/chadcluff.jpg` for the hero card.

---

## State of the Art

| Old Approach | Current Approach | When Changed | Impact |
|--------------|------------------|--------------|--------|
| `tailwind.config.js` JS config | `@theme` CSS directive in `app.css` | Tailwind v4 (Feb 2025) | No config file needed; tokens are CSS-native |
| PostCSS plugin for Tailwind | `@tailwindcss/vite` Vite plugin | Tailwind v4 | Different installation; PostCSS approach doesn't work in v4 |
| React Router "library mode" SPA (Vite + React, no framework) | React Router 7 "framework mode" with `ssr: false` | RR7 release (2024) | Same static output but with typed routes and better DX |
| `npx create-react-app` scaffolding | `npx create-react-router@latest` with templates | CRA deprecated 2022 | Vite-based, maintained, supports CF Pages templates |
| Cloudflare Workers + SSR for RR7 | Cloudflare Pages static + `ssr: false` | RR7 + CF Pages integration (2024-2025) | Simpler, cheaper (free tier), no cold starts for static content |

**Deprecated/outdated:**
- `tailwind.config.js`: Not used in v4. Do not create this file.
- `@react-router/cloudflare` Vite plugin in SPA mode: Conflicted; avoid for static deployments.
- `create-react-app (CRA)`: Officially deprecated; do not use.

---

## Open Questions

1. **GitHub repo `dchadcluff/twittercelebrity` accessibility**
   - What we know: User specified this exact repo slug
   - What's unclear: Whether the repo needs to be created before or after scaffolding
   - Recommendation: Create the GitHub repo first (empty, no files), then scaffold locally and push. This avoids merge conflicts.

2. **Celebrity photo sourcing approach**
   - What we know: Images must be locally hosted; Twitter CDN URLs are unstable
   - What's unclear: The best source for high-quality 200x200px photos (Twitter's own media, Google Image Search, official team sites)
   - Recommendation: Use Twitter/X profile pages directly during scaffold — right-click save the profile photo. They render at 400x400px, downscale to 200x200px during save. This is a one-time manual step per celebrity.

3. **Font loading strategy**
   - What we know: Cyberpunk aesthetic benefits from Orbitron or Rajdhani fonts
   - What's unclear: Whether to use Google Fonts CDN (fast, external dependency) or self-hosted font files (no external dependency, requires license check)
   - Recommendation: Google Fonts CDN via `@import` in `app.css` for Phase 1. Rajdhani is free (SIL Open Font License). Self-hosting is a Phase 4 polish consideration.

---

## Validation Architecture

### Test Framework

| Property | Value |
|----------|-------|
| Framework | None detected — greenfield project, no test infrastructure exists |
| Config file | None — see Wave 0 gaps below |
| Quick run command | `npm test` (after Wave 0 setup) |
| Full suite command | `npm test` (after Wave 0 setup) |

**Note:** Phase 1 is primarily infrastructure setup (scaffold, deploy, config, data files). The most meaningful validation is smoke testing the deployed URL — not unit tests. The recommended test approach for this phase is a smoke test checklist rather than automated unit tests, because the deliverables are configuration files, static data, and a verified deployment — not runtime logic.

### Phase Requirements → Test Map

| Req ID | Behavior | Test Type | Automated Command | File Exists? |
|--------|----------|-----------|-------------------|-------------|
| INFR-01 | RR7 SPA loads at root URL | Smoke | Manual: visit twittercelebrity.com | N/A |
| INFR-02 | Direct URL access returns 200, not 404 | Smoke | Manual: visit twittercelebrity.com/test-path | N/A |
| INFR-03 | twittercelebrity.com domain resolves to Cloudflare Pages | Smoke | Manual: DNS lookup + browser visit | N/A |
| CARD-07 | Celebrity data contains Elon Musk, no political figures | Unit | `npx tsx -e "import { CELEBRITIES } from './app/data/celebrities'; console.assert(CELEBRITIES.some(c => c.id === 'elon-musk'))"` | ❌ Wave 0 |
| CARD-08 | All photoPath values use local paths (no CDN URLs) | Unit | `npx tsx -e "import { CELEBRITIES } from './app/data/celebrities'; CELEBRITIES.forEach(c => console.assert(!c.photoPath.includes('twimg.com')))"` | ❌ Wave 0 |
| DESG-01 | Cyberpunk tokens defined in app.css | Manual | Inspect rendered CSS custom properties in browser DevTools | N/A |

### Sampling Rate

- **Per task commit:** Verify `npm run build` succeeds and produces `build/client/` without `404.html`
- **Per wave merge:** Full smoke checklist: (1) root URL loads, (2) direct URL access works, (3) no broken image icons, (4) neon token colors visible in DevTools
- **Phase gate:** All 4 smoke checks pass before moving to Phase 2

### Wave 0 Gaps

- [ ] No test framework installed — add `vitest` as dev dependency if automated tests are desired: `npm install -D vitest`
- [ ] No test files exist — the two CARD-07/CARD-08 data shape validations above can be run as one-off inline TypeScript assertions without a test framework

*(Infrastructure smoke tests for INFR-01, INFR-02, INFR-03, and DESG-01 are manual by nature and cannot be meaningfully automated in a static-site deploy context)*

---

## Sources

### Primary (HIGH confidence)

- `.planning/research/STACK.md` — Full stack configuration, versions, commands, deployment config; verified against official docs
- `.planning/research/PITFALLS.md` — SPA routing misconfiguration, Twitter CDN instability, Cloudflare plugin conflict; verified HIGH confidence
- `.planning/research/ARCHITECTURE.md` — Project structure, component responsibilities, data flow; HIGH confidence
- `.planning/research/FEATURES.md` — Feature landscape, MVP definition, priority matrix; HIGH confidence
- [React Router 7 Rendering Strategies](https://reactrouter.com/start/framework/rendering) — `ssr: false` SPA mode config confirmed
- [React Router 7 Pre-Rendering](https://reactrouter.com/how-to/pre-rendering) — `build/client/` output structure confirmed
- [Tailwind CSS v4 announcement](https://tailwindcss.com/blog/tailwindcss-v4) — `@theme` directive, Vite plugin, CSS-first approach confirmed
- [Cloudflare Pages — Deploy a React Site](https://developers.cloudflare.com/pages/configuration/serving-pages/) — `_redirects` SPA fallback behavior confirmed

### Secondary (MEDIUM confidence)

- [GitHub Discussion #12998](https://github.com/remix-run/react-router/discussions/12998) — `@react-router/cloudflare` Vite plugin + SPA mode conflict; workaround confirmed by community

### Tertiary (LOW confidence)

- Celebrity follower counts — approximate values from public knowledge (March 2026); exact counts not material to implementation

---

## Metadata

**Confidence breakdown:**
- Standard stack: HIGH — versions and config verified via official docs and project prior research
- Architecture: HIGH — project structure and patterns established in ARCHITECTURE.md with official doc backing
- Pitfalls: HIGH — SPA routing and image hosting pitfalls verified against Cloudflare Pages and RR7 official docs; Cloudflare plugin conflict confirmed via GitHub discussion
- Celebrity roster: MEDIUM — specific picks are Claude's discretion per CONTEXT.md; follower counts approximate

**Research date:** 2026-03-15
**Valid until:** 2026-04-15 (stable stack; React Router 7 and Tailwind v4 APIs unlikely to change within 30 days)
