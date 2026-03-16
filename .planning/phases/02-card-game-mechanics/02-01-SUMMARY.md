---
phase: 02-card-game-mechanics
plan: "01"
subsystem: game-state
tags: [game-reducer, framer-motion, react, tdd, vitest, components]
dependency_graph:
  requires: []
  provides: [game-state-machine, sticky-header, instruction-hint]
  affects: [02-02, 02-03]
tech_stack:
  added: [framer-motion@12, "@testing-library/react", "@testing-library/jest-dom", jsdom]
  patterns: [useReducer, Set-based dismissed tracking, TDD red-green, framer-motion AnimatePresence]
key_files:
  created:
    - app/state/gameReducer.ts
    - app/state/__tests__/gameReducer.test.ts
    - app/components/StickyHeader.tsx
    - app/components/InstructionHint.tsx
  modified:
    - package.json
    - package-lock.json
    - vitest.config.ts
decisions:
  - "gameReducer uses Set<string> for dismissed IDs — O(1) lookup, immutable copy per action"
  - "initializeGame places CHADCLUFF at end of shuffled array — guaranteed last position"
  - "vitest environment set to jsdom globally — supports future React component tests"
metrics:
  duration: "~2 min"
  completed: "2026-03-15"
  tasks_completed: 2
  files_changed: 7
---

# Phase 2 Plan 1: Game Reducer, StickyHeader, InstructionHint Summary

**One-liner:** Game state machine with DISMISS_CARD/isChad guard and reveal transition, plus StickyHeader and InstructionHint UI components using framer-motion.

---

## Tasks Completed

| Task | Name | Commit | Files |
|------|------|--------|-------|
| 1 | Install framer-motion, gameReducer with tests | 2c6d6bc | package.json, vitest.config.ts, gameReducer.ts, gameReducer.test.ts |
| 2 | Create StickyHeader and InstructionHint components | b7967bc | StickyHeader.tsx, InstructionHint.tsx |

---

## What Was Built

### Task 1: Game State Machine (TDD)

**RED phase:** Created `app/state/__tests__/gameReducer.test.ts` with 7 failing tests covering:
- DISMISS_CARD adds to dismissed Set
- isChad guard prevents dismissing chadcluff
- Phase transitions to 'reveal' when all 14 non-chad cards dismissed
- Phase stays 'browsing' until all 14 dismissed
- initializeGame shuffles celebrities with chadcluff appended at end
- initializeGame returns 15 total cards
- dismissed Set starts empty

**GREEN phase:** Implemented `app/state/gameReducer.ts` — all 7 tests pass, 18 total tests pass.

Dependencies installed: framer-motion@12, @testing-library/react, @testing-library/jest-dom, jsdom.

vitest.config.ts updated: `include` expanded to `["tests/**/*.test.ts", "app/**/*.test.{ts,tsx}"]`, `environment: "jsdom"` added.

### Task 2: UI Components

**StickyHeader:** Sticky cyberpunk header pinned at `top-0 z-50`, 48px height, `bg-cyber-black/90 backdrop-blur`, `border-b border-neon-cyan/20`, "Twitter Celebrity" in 28px bold neon-cyan.

**InstructionHint:** Accepts `dismissCount: number` prop. Uses `AnimatePresence` + `motion.p` for fade-in (500ms) and fade-out (800ms). Auto-hides after 4 seconds via `setTimeout`. Also hides immediately when `dismissCount > 0`. Text: "Tap × to eliminate" in 12px cyber-muted.

---

## Verification

- `npm test`: 18/18 tests pass (2 test files)
- `npx tsc --noEmit`: no errors
- `framer-motion` present in package.json dependencies
- All exports confirmed: `gameReducer`, `GameState`, `GameAction`, `GamePhase`, `initializeGame`
- `StickyHeader` and `InstructionHint` compile cleanly

---

## Deviations from Plan

None — plan executed exactly as written.

---

## Self-Check: PASSED

Files confirmed:
- FOUND: app/state/gameReducer.ts
- FOUND: app/state/__tests__/gameReducer.test.ts
- FOUND: app/components/StickyHeader.tsx
- FOUND: app/components/InstructionHint.tsx

Commits confirmed:
- FOUND: 2c6d6bc (feat(02-01): install framer-motion, gameReducer with tests, updated vitest config)
- FOUND: b7967bc (feat(02-01): create StickyHeader and InstructionHint components)
