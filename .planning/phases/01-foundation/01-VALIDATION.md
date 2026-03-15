---
phase: 1
slug: foundation
status: draft
nyquist_compliant: false
wave_0_complete: false
created: 2026-03-15
---

# Phase 1 — Validation Strategy

> Per-phase validation contract for feedback sampling during execution.

---

## Test Infrastructure

| Property | Value |
|----------|-------|
| **Framework** | vitest |
| **Config file** | none — Wave 0 installs |
| **Quick run command** | `npx vitest run --reporter=verbose` |
| **Full suite command** | `npx vitest run --reporter=verbose` |
| **Estimated runtime** | ~5 seconds |

---

## Sampling Rate

- **After every task commit:** Run `npx vitest run --reporter=verbose`
- **After every plan wave:** Run `npx vitest run --reporter=verbose`
- **Before `/gsd:verify-work`:** Full suite must be green
- **Max feedback latency:** 5 seconds

---

## Per-Task Verification Map

| Task ID | Plan | Wave | Requirement | Test Type | Automated Command | File Exists | Status |
|---------|------|------|-------------|-----------|-------------------|-------------|--------|
| TBD | TBD | TBD | INFR-01 | manual | Deploy + visit URL | N/A | ⬜ pending |
| TBD | TBD | TBD | INFR-02 | manual | Visit non-root URL | N/A | ⬜ pending |
| TBD | TBD | TBD | INFR-03 | manual | Visit twittercelebrity.com | N/A | ⬜ pending |
| TBD | TBD | TBD | CARD-07 | unit | `npx vitest run` | ❌ W0 | ⬜ pending |
| TBD | TBD | TBD | CARD-08 | unit | `npx vitest run` | ❌ W0 | ⬜ pending |
| TBD | TBD | TBD | DESG-01 | unit | `npx vitest run` | ❌ W0 | ⬜ pending |

*Status: ⬜ pending · ✅ green · ❌ red · ⚠️ flaky*

---

## Wave 0 Requirements

- [ ] Vitest installed and configured
- [ ] Test for celebrity data file (15 entries, Elon Musk present, no political figures)
- [ ] Test for celebrity images (all referenced images exist in public/images/celebrities/)
- [ ] Test for Tailwind theme tokens (cyberpunk colors defined)

*Infrastructure phase — deployment verification is manual (Cloudflare Pages).*

---

## Manual-Only Verifications

| Behavior | Requirement | Why Manual | Test Instructions |
|----------|-------------|------------|-------------------|
| Site loads at twittercelebrity.com | INFR-01 | Requires live deployment | Push to GitHub, verify CF Pages build, visit URL |
| SPA routing works on direct URL | INFR-02 | Requires live deployment | Visit twittercelebrity.com/anything, verify redirect |
| Domain serves correct site | INFR-03 | Requires DNS/domain config | Visit twittercelebrity.com, verify content |

---

## Validation Sign-Off

- [ ] All tasks have `<automated>` verify or Wave 0 dependencies
- [ ] Sampling continuity: no 3 consecutive tasks without automated verify
- [ ] Wave 0 covers all MISSING references
- [ ] No watch-mode flags
- [ ] Feedback latency < 5s
- [ ] `nyquist_compliant: true` set in frontmatter

**Approval:** pending
