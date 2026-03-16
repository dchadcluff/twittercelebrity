import { useReducer, useCallback } from "react";
import { gameReducer, initializeGame } from "../state/gameReducer";
import { CardGrid } from "../components/CardGrid";
import { StickyHeader } from "../components/StickyHeader";
import { InstructionHint } from "../components/InstructionHint";

export default function Home() {
  const [state, dispatch] = useReducer(gameReducer, undefined, initializeGame);

  const handleDismiss = useCallback(
    (id: string) => {
      dispatch({ type: "DISMISS_CARD", id });
    },
    [dispatch]
  );

  const dismissCount = state.dismissed.size;

  return (
    <div className="min-h-screen bg-cyber-black font-cyber">
      <StickyHeader />
      <InstructionHint dismissCount={dismissCount} />
      <CardGrid
        cards={state.cards}
        dismissed={state.dismissed}
        onDismiss={handleDismiss}
      />
    </div>
  );
}
