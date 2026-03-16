import { useReducer, useCallback, useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { gameReducer, initializeGame } from "../state/gameReducer";
import { CardGrid } from "../components/CardGrid";
import { StickyHeader } from "../components/StickyHeader";
import { InstructionHint } from "../components/InstructionHint";
import { CHADCLUFF } from "../data/chadcluff";

export default function Home() {
  const [state, dispatch] = useReducer(gameReducer, undefined, initializeGame);
  const [markedId, setMarkedId] = useState<string | null>(null);

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

  const dismissCount = state.dismissed.size;

  return (
    <div className="min-h-screen bg-cyber-black font-cyber">
      <StickyHeader />

      <AnimatePresence mode="wait">
        {state.phase === "browsing" ? (
          <motion.div
            key="browsing"
            exit={{ opacity: 0, transition: { duration: 0.3 } }}
            className="flex flex-col items-center justify-center"
            style={{ minHeight: "calc(100vh - 80px)" }}
          >
            <InstructionHint dismissCount={dismissCount} />
            <CardGrid
              cards={state.cards}
              dismissed={state.dismissed}
              markedId={markedId}
              onDismiss={handleDismiss}
            />
          </motion.div>
        ) : (
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
              className="text-2xl md:text-4xl font-bold text-neon-yellow mb-8 text-center tracking-wide drop-shadow-[0_0_20px_rgba(255,255,0,0.5)]"
            >
              The TRUE Twitter Celebrity!
            </motion.h2>

            {/* Hero card */}
            <motion.div
              initial={{ opacity: 0, scale: 0.6, y: 40 }}
              animate={{
                opacity: 1,
                scale: 1,
                y: 0,
                transition: {
                  delay: 1.2,
                  duration: 0.7,
                  ease: [0.34, 1.56, 0.64, 1],
                },
              }}
              className="w-72 md:w-80 rounded-xl overflow-hidden bg-cyber-panel border-2 border-neon-yellow shadow-[0_0_40px_rgba(255,255,0,0.4),0_0_80px_rgba(255,255,0,0.15)]"
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

            {/* Follow CTA */}
            <motion.a
              href="https://x.com/chadcluff"
              target="_blank"
              rel="noopener noreferrer"
              initial={{ opacity: 0 }}
              animate={{
                opacity: 1,
                transition: { delay: 2, duration: 0.5 },
              }}
              className="mt-8 px-8 py-3 rounded-lg bg-neon-cyan text-cyber-black font-bold text-lg hover:shadow-[0_0_20px_rgba(0,245,255,0.5)] transition-shadow"
            >
              Follow {CHADCLUFF.handle}
            </motion.a>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
