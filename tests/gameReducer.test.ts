import { describe, it, expect } from "vitest";
import { gameReducer, initializeGame } from "../app/state/gameReducer";

describe("gameReducer", () => {
  describe("REPLAY", () => {
    it("returns state with phase 'browsing'", () => {
      const revealState = { ...initializeGame(), phase: "reveal" as const };
      const result = gameReducer(revealState, { type: "REPLAY" });
      expect(result.phase).toBe("browsing");
    });

    it("returns empty dismissed Set (size 0)", () => {
      const state = initializeGame();
      const withDismissed = { ...state, dismissed: new Set(["elon-musk", "the-rock"]) };
      const result = gameReducer(withDismissed, { type: "REPLAY" });
      expect(result.dismissed.size).toBe(0);
    });

    it("returns exactly 7 cards", () => {
      const state = initializeGame();
      const result = gameReducer(state, { type: "REPLAY" });
      expect(result.cards).toHaveLength(7);
    });

    it("always includes a card with isChad=true", () => {
      const state = initializeGame();
      const result = gameReducer(state, { type: "REPLAY" });
      const chadCard = result.cards.find((c) => c.isChad);
      expect(chadCard).toBeDefined();
      expect(chadCard!.id).toBe("chadcluff");
    });

    it("from 'reveal' phase produces new 'browsing' state", () => {
      const revealState = { ...initializeGame(), phase: "reveal" as const };
      const result = gameReducer(revealState, { type: "REPLAY" });
      expect(result.phase).toBe("browsing");
      expect(result.dismissed.size).toBe(0);
      expect(result.cards).toHaveLength(7);
    });

    it("two consecutive REPLAY calls can produce different card orders", () => {
      // Run 10 times — at least one pair should differ (safe with 14 celebrities pick 6)
      let foundDifference = false;
      const state = initializeGame();
      for (let i = 0; i < 10; i++) {
        const r1 = gameReducer(state, { type: "REPLAY" });
        const r2 = gameReducer(state, { type: "REPLAY" });
        const order1 = r1.cards.map((c) => c.id).join(",");
        const order2 = r2.cards.map((c) => c.id).join(",");
        if (order1 !== order2) {
          foundDifference = true;
          break;
        }
      }
      expect(foundDifference).toBe(true);
    });
  });

  describe("DISMISS_CARD", () => {
    it("transitions phase to 'reveal' when last non-chad card is dismissed", () => {
      const state = initializeGame();
      // Dismiss all non-chad cards one by one
      const nonChadCards = state.cards.filter((c) => !c.isChad);
      let current = state;
      for (const card of nonChadCards) {
        current = gameReducer(current, { type: "DISMISS_CARD", id: card.id });
      }
      expect(current.phase).toBe("reveal");
    });

    it("does not transition to 'reveal' until all non-chad cards are dismissed", () => {
      const state = initializeGame();
      const nonChadCards = state.cards.filter((c) => !c.isChad);
      // Dismiss all but the last non-chad
      let current = state;
      for (let i = 0; i < nonChadCards.length - 1; i++) {
        current = gameReducer(current, { type: "DISMISS_CARD", id: nonChadCards[i].id });
        expect(current.phase).toBe("browsing");
      }
    });

    it("returns unchanged state when dismissing a chad card", () => {
      const state = initializeGame();
      const chadCard = state.cards.find((c) => c.isChad)!;
      const result = gameReducer(state, { type: "DISMISS_CARD", id: chadCard.id });
      expect(result).toBe(state); // Same reference — no state change
    });

    it("adds dismissed card id to dismissed set", () => {
      const state = initializeGame();
      const nonChad = state.cards.find((c) => !c.isChad)!;
      const result = gameReducer(state, { type: "DISMISS_CARD", id: nonChad.id });
      expect(result.dismissed.has(nonChad.id)).toBe(true);
    });
  });
});
