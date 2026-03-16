---
phase: 2
slug: card-game-mechanics
status: draft
nyquist_compliant: false
wave_0_complete: false
created: 2026-03-15
---

# Phase 2 — Validation Strategy

> Per-phase validation contract for feedback sampling during execution.

---

## Test Infrastructure

| Property | Value |
|----------|-------|
| **Framework** | Vitest 4.1.0 |
| **Config file** | vitest.config.ts (exists from Phase 1) |
| **Quick run command** | `npm test` |
| **Full suite command** | `npm test` |
| **Estimated runtime** | ~10 seconds |

---

## Sampling Rate

- **After every task commit:** Run `npm test`
- **After every plan wave:** Run `npm test`
- **Before `/gsd:verify-work`:** Full suite must be green
- **Max feedback latency:** 10 seconds

---

## Per-Task Verification Map

| Task ID | Plan | Wave | Requirement | Test Type | Automated Command | File Exists | Status |
|---------|------|------|-------------|-----------|-------------------|-------------|--------|
| TBD | TBD | 0 | CARD-01 | unit | `npm test` | ❌ W0 | ⬜ pending |
| TBD | TBD | 0 | CARD-02 | unit | `npm test` | ❌ W0 | ⬜ pending |
| TBD | TBD | 0 | CARD-03 | unit | `npm test` | ❌ W0 | ⬜ pending |
| TBD | TBD | 0 | CARD-04 | unit | `npm test` | ❌ W0 | ⬜ pending |
| TBD | TBD | 0 | CARD-05 | unit | `npm test` | ❌ W0 | ⬜ pending |
| TBD | TBD | 0 | CARD-06 | unit | `npm test` | ❌ W0 | ⬜ pending |
| TBD | TBD | TBD | DESG-04 | manual | Visual inspection at breakpoints | N/A | ⬜ pending |

*Status: ⬜ pending · ✅ green · ❌ red · ⚠️ flaky*

---

## Wave 0 Requirements

- [ ] `npm install framer-motion` — Framer Motion not yet installed
- [ ] `app/components/__tests__/CardGrid.test.tsx` — covers CARD-01 (grid renders all cards)
- [ ] `app/components/__tests__/CelebrityCard.test.tsx` — covers CARD-02, CARD-03, CARD-04, CARD-05
- [ ] `app/components/__tests__/CardGrid.entry.test.tsx` — covers CARD-06 (stagger entry)
- [ ] `app/state/__tests__/gameReducer.test.ts` — unit tests for reducer: DISMISS_CARD, phase transition, isChad guard
- [ ] `app/__tests__/setup/framer-motion.mock.ts` — shared Framer Motion mock for all tests

---

## Manual-Only Verifications

| Behavior | Requirement | Why Manual | Test Instructions |
|----------|-------------|------------|-------------------|
| Grid responsive columns (2/3/4) | DESG-04 | CSS grid columns cannot be tested in jsdom | Resize browser to 375px, 768px, 1280px and verify column count |
| Swipe gesture on real device | CARD-04 | DevTools touch emulation misses passive listener behavior | Test on real iOS/Android device |

---

## Validation Sign-Off

- [ ] All tasks have `<automated>` verify or Wave 0 dependencies
- [ ] Sampling continuity: no 3 consecutive tasks without automated verify
- [ ] Wave 0 covers all MISSING references
- [ ] No watch-mode flags
- [ ] Feedback latency < 10s
- [ ] `nyquist_compliant: true` set in frontmatter

**Approval:** pending
