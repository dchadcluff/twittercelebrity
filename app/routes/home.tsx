import { useReducer, useCallback, useEffect, useState } from "react";
import { gameReducer, initializeGame } from "../state/gameReducer";
import { CardGrid } from "../components/CardGrid";
import { StickyHeader } from "../components/StickyHeader";
import { InstructionHint } from "../components/InstructionHint";

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
      // Mark the card (shows red X glow + "not a twitter celebrity")
      setMarkedId(target.id);

      // After 800ms flash, dismiss it
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
      <InstructionHint dismissCount={dismissCount} />
      <CardGrid
        cards={state.cards}
        dismissed={state.dismissed}
        markedId={markedId}
        onDismiss={handleDismiss}
      />
    </div>
  );
}
