import type { CelebrityCard } from "./types";
import { CELEBRITIES } from "../data/celebrities";
import { CHADCLUFF } from "../data/chadcluff";

export type GamePhase = "browsing" | "reveal" | "post";

export interface GameState {
  phase: GamePhase;
  cards: CelebrityCard[];
  dismissed: Set<string>;
}

export type GameAction =
  | { type: "DISMISS_CARD"; id: string }
  | { type: "TRIGGER_REVEAL" }
  | { type: "REPLAY" };

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export function initializeGame(): GameState {
  return {
    phase: "browsing",
    cards: (() => {
      // Pick 6 random celebrities from the full roster
      const picked = shuffle(CELEBRITIES).slice(0, 6);
      // Insert @chadcluff at position 4 (index 3)
      picked.splice(3, 0, CHADCLUFF);
      return picked;
    })(),
    dismissed: new Set<string>(),
  };
}

export function gameReducer(state: GameState, action: GameAction): GameState {
  switch (action.type) {
    case "DISMISS_CARD": {
      // Guard: cannot dismiss @chadcluff
      const card = state.cards.find((c) => c.id === action.id);
      if (!card || card.isChad) return state;

      const dismissed = new Set(state.dismissed);
      dismissed.add(action.id);
      const nonChadRemaining = state.cards.filter(
        (c) => !dismissed.has(c.id) && !c.isChad
      );
      const phase: GamePhase =
        nonChadRemaining.length === 0 ? "reveal" : "browsing";
      return { ...state, dismissed, phase };
    }
    default:
      return state;
  }
}
