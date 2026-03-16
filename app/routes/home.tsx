import React, { useReducer, useCallback, useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import confetti from "canvas-confetti";
import { gameReducer, initializeGame } from "../state/gameReducer";
import { CardGrid } from "../components/CardGrid";
import { StickyHeader } from "../components/StickyHeader";
// InstructionHint removed — not needed
import { CHADCLUFF } from "../data/chadcluff";

export default function Home() {
  const [state, dispatch] = useReducer(gameReducer, undefined, initializeGame);
  const [markedId, setMarkedId] = useState<string | null>(null);
  const [revealReady, setRevealReady] = useState(false);

  const handleDismiss = useCallback(
    (id: string) => {
      dispatch({ type: "DISMISS_CARD", id });
      // Clear mark if the user manually dismisses the marked card
      setMarkedId((prev) => (prev === id ? null : prev));
    },
    [dispatch]
  );

  // Auto-dismiss: every 2 seconds, mark a random non-chad card, then dismiss after a brief flash
  useEffect(() => {
    if (state.phase !== "browsing") return;

    const interval = setInterval(() => {
      const remaining = state.cards.filter(
        (c) => !state.dismissed.has(c.id) && !c.isChad
      );
      if (remaining.length === 0) return;

      const target = remaining[Math.floor(Math.random() * remaining.length)];
      setMarkedId(target.id);

      setTimeout(() => {
        dispatch({ type: "DISMISS_CARD", id: target.id });
        setMarkedId(null);
      }, 800);
    }, 2000);

    return () => clearInterval(interval);
  }, [state.cards, state.dismissed, state.phase]);

  // REVL-02/REVL-03: Deliberate pause after browsing exit before reveal entrance
  useEffect(() => {
    if (state.phase !== "reveal") {
      setRevealReady(false);
      return;
    }
    // Browsing container fades out (0.5s), then wait for deliberate pause before reveal enters
    const timer = setTimeout(() => setRevealReady(true), 600);
    return () => clearTimeout(timer);
  }, [state.phase]);

  // REVL-05: Double-cannon confetti burst fires when reveal screen mounts
  useEffect(() => {
    if (!revealReady) return;
    const timer = setTimeout(() => {
      confetti({
        particleCount: 100,
        spread: 70,
        startVelocity: 55,
        origin: { x: 0.3, y: 0.5 },
        colors: ["#00f5ff", "#ff006e", "#ffd700"],
        disableForReducedMotion: true,
      });
      confetti({
        particleCount: 100,
        spread: 70,
        startVelocity: 55,
        origin: { x: 0.7, y: 0.5 },
        colors: ["#00f5ff", "#ff006e", "#ffd700"],
        disableForReducedMotion: true,
      });
    }, 1400);
    return () => clearTimeout(timer);
  }, [revealReady]);

  const dismissCount = state.dismissed.size;

  return (
    <div className="min-h-screen bg-cyber-black font-cyber">
      <StickyHeader />

      <AnimatePresence mode="wait">
        {state.phase === "browsing" ? (
          <motion.div
            key="browsing"
            exit={{ opacity: 0, transition: { duration: 0.5, ease: "easeInOut" } }}
            className="flex flex-col items-center justify-center"
            style={{ minHeight: "calc(100vh - 80px)" }}
          >
            <CardGrid
              cards={state.cards}
              dismissed={state.dismissed}
              markedId={markedId}
              onDismiss={handleDismiss}
            />
          </motion.div>
        ) : revealReady ? (
          <motion.div
            key="reveal"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{
              opacity: 1,
              scale: 1,
              transition: { delay: 0.5, duration: 0.8, ease: "easeOut" },
            }}
            className="flex flex-col items-center justify-center px-4"
            style={{ minHeight: "calc(100vh - 80px)" }}
          >
            {/* "The TRUE Twitter Celebrity!" title */}
            <motion.h2
              initial={{ opacity: 0, y: -30 }}
              animate={{
                opacity: 1,
                y: 0,
                transition: { delay: 0.8, duration: 0.6 },
              }}
              className="text-2xl md:text-4xl font-bold text-neon-yellow mb-8 text-center tracking-wide drop-shadow-[0_0_20px_rgba(255,255,0,0.5)] glitch-text"
              data-text="The TRUE Twitter Celebrity!"
            >
              The TRUE Twitter Celebrity!
            </motion.h2>

            {/* Hero card — REVL-06: animated pulsing neon glow */}
            <motion.div
              initial={{ opacity: 0, scale: 0.6, y: 40 }}
              animate={{
                opacity: 1,
                scale: 1,
                y: 0,
                boxShadow: [
                  "0 0 40px rgba(255,255,0,0.4), 0 0 80px rgba(255,255,0,0.15)",
                  "0 0 60px rgba(255,255,0,0.6), 0 0 120px rgba(255,255,0,0.3)",
                  "0 0 40px rgba(255,255,0,0.4), 0 0 80px rgba(255,255,0,0.15)",
                ],
                transition: {
                  delay: 1.2,
                  duration: 0.7,
                  ease: [0.34, 1.56, 0.64, 1],
                  boxShadow: {
                    delay: 2.0,
                    duration: 2,
                    repeat: Infinity,
                    repeatType: "loop" as const,
                  },
                },
              }}
              className="w-72 md:w-80 rounded-xl overflow-hidden bg-cyber-panel border-2 border-neon-yellow"
            >
              <img
                src={CHADCLUFF.photoPath}
                alt={CHADCLUFF.displayName}
                className="w-full h-64 object-cover"
              />
              <div className="p-6 text-center">
                <p className="text-xl font-bold text-cyber-text">
                  {CHADCLUFF.displayName}
                </p>
                <p className="text-neon-cyan font-bold mt-1">
                  {CHADCLUFF.handle}
                </p>
                <p className="text-cyber-text mt-3 text-sm">{CHADCLUFF.bio}</p>
              </div>
            </motion.div>

            {/* POST-04: Witty tagline */}
            <motion.p
              initial={{ opacity: 0 }}
              animate={{
                opacity: 1,
                transition: { delay: 1.8, duration: 0.5 },
              }}
              className="mt-6 text-lg text-cyber-text/80 text-center italic max-w-md"
            >
              You swiped away the rest. Only the real one remains.
            </motion.p>

            {/* CTAs: Follow (POST-01), Share on X (POST-02), Play Again */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{
                opacity: 1,
                y: 0,
                transition: { delay: 2.0, duration: 0.5 },
              }}
              className="mt-8 flex gap-4 flex-wrap justify-center"
            >
              <a
                href="https://x.com/chadcluff"
                target="_blank"
                rel="noopener noreferrer"
                className="px-6 py-3 rounded-lg bg-neon-cyan text-cyber-black font-bold text-lg neon-glow-cta"
                style={{ "--glow-color": "rgba(0, 245, 255, 0.5)" } as React.CSSProperties}
              >
                Follow @chadcluff
              </a>
              <a
                href={`https://x.com/intent/tweet?text=${encodeURIComponent("Think you know who the real Twitter Celebrity is? Find out \u2192 twittercelebrity.com")}`}
                target="_blank"
                rel="noopener noreferrer"
                className="px-6 py-3 rounded-lg bg-neon-pink text-cyber-black font-bold text-lg neon-glow-cta"
                style={{ "--glow-color": "rgba(255, 0, 110, 0.5)" } as React.CSSProperties}
              >
                Share on X
              </a>
              <button
                onClick={() => dispatch({ type: "REPLAY" })}
                className="px-6 py-3 rounded-lg border-2 border-neon-yellow text-neon-yellow font-bold text-lg hover:bg-neon-yellow hover:text-cyber-black transition-colors neon-glow-cta"
                style={{ "--glow-color": "rgba(245, 230, 66, 0.5)" } as React.CSSProperties}
              >
                Play Again
              </button>
            </motion.div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </div>
  );
}
