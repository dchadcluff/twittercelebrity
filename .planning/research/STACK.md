# Stack Research

**Domain:** Interactive card-game landing page, cyberpunk aesthetic, static site
**Researched:** 2026-03-15
**Confidence:** HIGH (core stack verified via official docs and npm registry; animation recommendations MEDIUM — multiple sources confirm but library choice involves tradeoffs)

---

## Recommended Stack

### Core Technologies

| Technology | Version | Purpose | Why Recommended |
|------------|---------|---------|-----------------|
| React Router 7 | 7.13.1 | Framework, routing, SPA mode | Mandated by project. Framework mode with `ssr: false` produces a static SPA bundle that Cloudflare Pages serves perfectly. Built on Vite, excellent DX. |
| React | 19.x | UI rendering | Required by React Router 7. React 19 includes concurrent features that Framer Motion 12.x leverages for smoother layout animations. |
| TypeScript | 5.9.x | Type safety | Standard for all new React Router 7 projects — the framework generates typed route modules. Skip this and you lose `loaderData` type inference for free. |
| Vite | 8.x | Build tool | React Router 7's compiler is built on Vite. Vite 8 uses Rolldown internally for up to 30x faster builds. React Router 7 scaffolding installs Vite automatically. |
| Tailwind CSS | 4.2.x | Utility-first CSS | v4 is CSS-first (no JS config file), zero-config content detection, and 100x faster incremental builds. Cyberpunk neon effects (glow, box-shadow, text-shadow) are trivially composable as utility classes. v3 is still usable but v4 is the current standard. |

### Animation and Interaction

| Library | Version | Purpose | When to Use |
|---------|---------|---------|-------------|
| framer-motion (Motion for React) | 12.x | Card animations, drag/swipe gestures, reveal sequence | Use for all animations. The `drag` prop + `useMotionValue` handles swipe-to-dismiss natively — no separate gesture library needed. Timeline sequences via `AnimatePresence` orchestrate the final reveal. |
| canvas-confetti | 1.9.4 | Confetti burst on reveal | Lightweight (3 KB), zero dependencies, fires and forgets. Perfect for the reveal moment. Do NOT use tsParticles — it's heavier (45+ KB) and adds unnecessary config surface. |

### Cyberpunk Visual Effects

| Library / Approach | Purpose | When to Use |
|-------------------|---------|-------------|
| Pure CSS + Tailwind utilities | Glitch text, neon glow, scanline overlay, CRT flicker | Use CSS `@keyframes` with `clip-path: inset()` for glitch. Tailwind's arbitrary values for neon box-shadow (`shadow-[0_0_20px_#00ffff]`). No library needed — CSS handles it cleanly and keeps bundle minimal. |
| CSS custom properties via Tailwind v4 `@theme` | Color tokens (neon cyan, hot pink, electric yellow) | Define once in `app.css`, use everywhere. v4's `@theme` directive replaces the old JS config. |

### Development Tools

| Tool | Purpose | Notes |
|------|---------|-------|
| @react-router/dev | CLI, build, type generation | Install as a dev dependency. Runs `react-router build` which outputs to `build/client/` — that directory is what Cloudflare Pages serves. |
| @react-router/cloudflare | Cloudflare platform bindings | Install even for static deployments — provides `cloudflareDevProxyVitePlugin` for local dev parity and future-proofs if you add Workers bindings later. |
| Wrangler | Cloudflare CLI for local dev and deploy | Use `wrangler pages dev` to test locally with Cloudflare's runtime. Deploy via `wrangler pages deploy build/client`. Version 3.x is current. |
| ESLint + eslint-plugin-react-hooks | Lint | React Router scaffolding includes this. Don't skip it — hooks exhaustive-deps catches bugs in animation callbacks. |
| Prettier | Format | Standard. Configure once, forget forever. |

---

## Deployment Configuration

React Router 7 framework mode with `ssr: false` is the correct approach for this project. This is not the same as the old "library mode" SPA setup — it still uses the full framework (typed routes, loaders, `react-router.config.ts`) but outputs a purely static bundle with no server runtime required.

**react-router.config.ts:**
```typescript
import type { Config } from "@react-router/dev/config";

export default {
  ssr: false,
} satisfies Config;
```

This outputs everything to `build/client/`. Cloudflare Pages build config:
- Build command: `npm run build`
- Build output directory: `build/client`
- Node version: 20.x (required by React Router 7)

For SPA routing to work on Cloudflare Pages (so `/` routes don't 404 on direct navigation), add a `_redirects` file in `public/`:
```
/* /index.html 200
```

---

## Installation

```bash
# Scaffold (recommended — gets the Cloudflare template wired up)
npx create-react-router@latest twittercelebrity --template remix-run/react-router-templates/cloudflare

# Or if starting fresh, core dependencies
npm install react react-dom react-router @react-router/cloudflare

# Animation and effects
npm install framer-motion canvas-confetti

# Dev dependencies
npm install -D @react-router/dev vite @vitejs/plugin-react typescript tailwindcss @types/react @types/react-dom @types/canvas-confetti wrangler
```

---

## Alternatives Considered

| Recommended | Alternative | When to Use Alternative |
|-------------|-------------|-------------------------|
| framer-motion (drag prop) | react-swipeable | Only if NOT using Framer Motion at all — it's a lightweight hook for gesture detection only. Since this project needs rich animations AND gestures, framer-motion handles both. Adding react-swipeable on top of framer-motion is redundant. |
| framer-motion | GSAP | Use GSAP if you need timeline-based cinematic sequences with fine-grained scrubbing (e.g., a scroll-driven animation). GSAP's license prohibits use in Webflow competitors but that's not relevant here. For this project, Framer Motion's declarative API and `AnimatePresence` are more ergonomic. |
| canvas-confetti | @tsparticles/confetti | tsParticles if you need persistent particle backgrounds (ambient cyberpunk particles floating around). For a one-shot confetti burst, canvas-confetti is 15x smaller. |
| Tailwind CSS v4 | vanilla CSS | Only if the team is not comfortable with Tailwind — but cyberpunk effects are utility-class-friendly and Tailwind v4's CSS-first approach is actually ideal for custom neon color tokens. |
| React Router 7 SPA mode | Vite + React (library mode) | If you need zero framework overhead and the app has no routes at all. This project is a single-page experience with no navigation, so technically library mode would work — but React Router 7 framework mode is still the right call because the project mandates it and it provides better DX with no meaningful overhead cost. |
| Cloudflare Pages (static) | Cloudflare Workers (SSR) | Workers if you need edge-rendered dynamic content, A/B testing, or personalization. This project is static — no server needed, and free tier static Pages is simpler to operate. |

---

## What NOT to Use

| Avoid | Why | Use Instead |
|-------|-----|-------------|
| Next.js | Not the mandated framework. Also overkill for a static one-page experience. | React Router 7 |
| Styled Components / Emotion | CSS-in-JS adds runtime overhead and plays poorly with Tailwind v4's compile-time architecture. | Tailwind CSS + CSS modules if scoping needed |
| react-spring | Older API, less active development, harder to coordinate complex multi-element sequences. Framer Motion's `AnimatePresence` + variants are better for the reveal sequence. | framer-motion |
| jQuery / Vanilla JS animation libraries (Anime.js, etc.) | Not React-aware — managing refs manually for a complex card deck is error-prone and defeats the benefit of React. | framer-motion |
| Twitter/X API (client-side) | Rate-limited, requires auth, adds latency. Project spec explicitly says static data. | Hardcoded JSON data file with a refresh script |
| SSR / Cloudflare Workers for this project | Adds operational complexity (Worker billing, request limits, cold starts) with zero benefit for a static experience. | Cloudflare Pages static deployment |
| react-tinder-card | Unmaintained (last publish ~2 years ago), limited customization for cyberpunk styling. Framer Motion's `drag` prop replicates the behavior with full control. | framer-motion drag |

---

## Stack Patterns by Variant

**For the card drag/swipe dismiss interaction:**
- Use `motion.div` with `drag="x"` and `dragConstraints={{ left: 0, right: 0 }}`
- Use `useMotionValue` + `useTransform` for rotation and opacity tied to drag position
- On `onDragEnd`, check `offset.x` threshold (e.g., > 100px) to trigger dismiss
- This is the exact pattern from the Framer Motion docs — no third-party card lib needed

**For the reveal sequence animation:**
- Use `AnimatePresence` to animate cards out as they're dismissed
- Final reveal: trigger a `useAnimate` sequence — cards fly to edges, spotlight fades in, confetti fires, `@chadcluff` card scales to hero
- `canvas-confetti` fires as a side-effect on sequence start (not tied to React render cycle — just `confetti()` call in a `useEffect`)

**For cyberpunk glitch text:**
- Implement with pure CSS `@keyframes` using `clip-path: inset()` on `::before`/`::after` pseudo-elements
- Layer offset cyan and magenta copies for chromatic aberration effect
- Trigger via CSS class toggle or Framer Motion `onAnimationComplete` callback

---

## Version Compatibility

| Package | Compatible With | Notes |
|---------|-----------------|-------|
| react-router@7.13.1 | react@18 or react@19 | React 19 preferred — RR7 framework mode works with both but React 19 concurrent features improve layout animations |
| framer-motion@12.x | react@18+, react@19 | v12 added React 19 support explicitly. Do NOT use framer-motion@10 or earlier — layout animation API changed significantly in v11. |
| tailwindcss@4.x | Vite 8, PostCSS | v4 uses a Vite plugin (`@tailwindcss/vite`) instead of PostCSS in Vite projects. Install `@tailwindcss/vite` not `tailwindcss` PostCSS plugin. |
| canvas-confetti@1.9.4 | Any modern browser | No React peer dependency — works as a plain function call. |
| @react-router/dev | Vite 5+ | RR7 7.x ships with its own Vite dependency — check peer deps of installed version, do not independently upgrade Vite without verifying compatibility. |

---

## Sources

- [React Router 7 — Rendering Strategies](https://reactrouter.com/start/framework/rendering) — confirmed `ssr: false` SPA mode and prerender options. HIGH confidence.
- [React Router 7 — Pre-Rendering How-To](https://reactrouter.com/how-to/pre-rendering) — confirmed static build output structure (`build/client/`). HIGH confidence.
- [React Router 7 — Deploying](https://reactrouter.com/start/framework/deploying) — confirmed Cloudflare maintains a React Router template. HIGH confidence.
- [Cloudflare Pages — Deploy a React Site](https://developers.cloudflare.com/pages/framework-guides/deploy-a-react-site/) — confirmed build command `npm run build`, output dir `dist` (Vite default) / `build/client` for RR7. HIGH confidence.
- [npm: react-router@7.13.1](https://www.npmjs.com/package/react-router) — version confirmed. HIGH confidence.
- [npm: framer-motion@12.x](https://www.npmjs.com/package/framer-motion) — version 12.36.0 current as of March 2026. HIGH confidence.
- [npm: canvas-confetti@1.9.4](https://www.npmjs.com/package/canvas-confetti) — version confirmed. HIGH confidence.
- [Tailwind CSS v4.0 announcement](https://tailwindcss.com/blog/tailwindcss-v4) — v4.2.x current, CSS-first config confirmed. HIGH confidence.
- [Motion for React — Drag API](https://motion.dev/docs/react-drag) — drag prop + useMotionValue pattern confirmed. HIGH confidence.
- [Motion vs GSAP comparison](https://motion.dev/docs/gsap-vs-motion) — bundle size, MIT license, React-native API comparison. MEDIUM confidence (source is Motion's own docs, inherently biased).
- [TypeScript 5.9](https://www.typescriptlang.org/docs/handbook/release-notes/typescript-5-9.html) — 5.9.x confirmed current. HIGH confidence.
- [Vite 8.0 announcement](https://vite.dev/blog/announcing-vite8) — Vite 8 current, Rolldown bundler. HIGH confidence.
- Community discussions re: Cloudflare Vite plugin + SPA mode limitations — [GitHub Discussion #12998](https://github.com/remix-run/react-router/discussions/12998) — flagged as LOW confidence, monitor for resolution; workaround is `ssr:false` without the Cloudflare Vite plugin for pure static deploy.

---

*Stack research for: Interactive cyberpunk card-game landing page (twittercelebrity.com)*
*Researched: 2026-03-15*
