# Phase 3: Reveal and Post-Reveal - Validation

**Phase:** 03-reveal-and-post-reveal
**Created:** 2026-03-15

---

## Requirements Coverage

| Req ID | Description | Plan | Task | Test Type | Automated Command |
|--------|-------------|------|------|-----------|-------------------|
| REVL-01 | Dismiss last non-chad card triggers reveal | 03-01 | Task 1 | unit | `npm test -- tests/gameReducer.test.ts` |
| REVL-02 | Remaining cards fly away in staggered exit | 03-02 | Task 1 | manual + grep | `grep -q "revealReady" app/routes/home.tsx` |
| REVL-03 | Deliberate pause between exits and entrance | 03-02 | Task 1 | manual | Visual: ~0.6s gap between browsing fade and reveal entrance |
| REVL-04 | Hero card scales in with spring animation | 03-02 | Task 1 | manual + grep | `grep -q "0.34, 1.56, 0.64, 1" app/routes/home.tsx` |
| REVL-05 | Confetti burst fires during reveal | 03-02 | Task 1 | manual + grep | `grep -q "confetti(" app/routes/home.tsx` |
| REVL-06 | Neon spotlight glow on hero card | 03-02 | Task 1 | manual + grep | `grep -q "boxShadow" app/routes/home.tsx` |
| POST-01 | Follow CTA links to x.com/chadcluff | 03-02 | Task 0+1 | unit + grep | `npm test -- tests/reveal.test.ts && grep -q "x.com/chadcluff" app/routes/home.tsx` |
| POST-02 | Share on X via Web Intent with encoded text | 03-02 | Task 0+1 | unit + grep | `npm test -- tests/reveal.test.ts && grep -q "x.com/intent/tweet" app/routes/home.tsx` |
| POST-03 | Replay resets game with fresh shuffled cards | 03-01 | Task 1 | unit | `npm test -- tests/gameReducer.test.ts` |
| POST-04 | Witty bio/tagline on hero screen | 03-02 | Task 1 | grep | `grep -q "You swiped away the rest" app/routes/home.tsx` |

## Test Files

| File | Covers | Status |
|------|--------|--------|
| tests/gameReducer.test.ts | REVL-01, POST-03 | Created in 03-01 |
| tests/reveal.test.ts | POST-01, POST-02 | Created in 03-02 Task 0 |
| tests/celebrity-data.test.ts | Celebrity data integrity | Pre-existing (Phase 1) |

## Automated Validation Script

```bash
#!/bin/bash
set -e

echo "=== Phase 3 Validation ==="

# Build check
echo "[1/8] Build passes..."
npm run build

# Test suite
echo "[2/8] All tests pass..."
npm test

# REVL-01: Reveal transition in reducer
echo "[3/8] REVL-01: Reveal transition..."
grep -q 'phase.*reveal' app/state/gameReducer.ts

# REVL-02: Staggered exit mechanism
echo "[4/8] REVL-02: Staggered exit state..."
grep -q 'revealReady' app/routes/home.tsx

# REVL-05: Confetti integration
echo "[5/8] REVL-05: Confetti..."
grep -q 'canvas-confetti' app/routes/home.tsx
grep -q 'disableForReducedMotion' app/routes/home.tsx

# REVL-06: Animated glow
echo "[6/8] REVL-06: Animated glow..."
grep -q 'boxShadow' app/routes/home.tsx

# POST-01 + POST-02: URLs
echo "[7/8] POST-01/02: Follow and Share URLs..."
grep -q 'x.com/chadcluff' app/routes/home.tsx
grep -q 'x.com/intent/tweet' app/routes/home.tsx
grep -q 'encodeURIComponent' app/routes/home.tsx

# POST-04: Tagline
echo "[8/8] POST-04: Tagline..."
grep -q 'You swiped away the rest' app/routes/home.tsx

echo "=== All Phase 3 checks passed ==="
```

## Manual Verification Checklist

These items require visual/interactive testing (covered by 03-02 Task 2 checkpoint):

- [ ] REVL-02: Cards fly away individually during auto-dismiss (not all at once)
- [ ] REVL-03: Deliberate pause (~0.6s) between browsing exit and reveal entrance
- [ ] REVL-04: Hero card scales in with spring overshoot animation
- [ ] REVL-05: Double confetti burst visible (neon cyan, pink, yellow particles)
- [ ] REVL-06: Hero card glow pulses continuously after entrance
- [ ] POST-01: "Follow @chadcluff" opens x.com/chadcluff in new tab
- [ ] POST-02: "Share on X" opens pre-filled tweet on x.com
- [ ] POST-04: Tagline text visible below hero card
- [ ] Replay resets game with different random celebrities
- [ ] Mobile layout (375px): CTAs wrap correctly
