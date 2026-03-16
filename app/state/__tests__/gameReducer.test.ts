import { describe, it, expect } from "vitest";
import { gameReducer, initializeGame } from "../gameReducer";
import { CELEBRITIES } from "../../data/celebrities";

describe("gameReducer", () => {
  it("DISMISS_CARD removes card from dismissed set — dismissed.has(id) === true after dispatch", () => {
    const state = initializeGame();
    // Pick a non-chad card that's actually in the random selection
    const nonChad = state.cards.find((c) => !c.isChad)!;
    const next = gameReducer(state, { type: "DISMISS_CARD", id: nonChad.id });
    expect(next.dismissed.has(nonChad.id)).toBe(true);
  });

  it("DISMISS_CARD for isChad card is ignored — dismissed set unchanged", () => {
    const state = initializeGame();
    const next = gameReducer(state, { type: "DISMISS_CARD", id: "chadcluff" });
    expect(next.dismissed.size).toBe(0);
  });

  it("Phase transitions to 'reveal' when all 6 non-chad cards are dismissed", () => {
    let state = initializeGame();
    const nonChad = state.cards.filter((c) => !c.isChad);
    for (const card of nonChad) {
      state = gameReducer(state, { type: "DISMISS_CARD", id: card.id });
    }
    expect(state.phase).toBe("reveal");
  });

  it("Phase stays 'browsing' when only some non-chad cards are dismissed", () => {
    let state = initializeGame();
    const nonChad = state.cards.filter((c) => !c.isChad);
    // Dismiss only 3 cards
    for (let i = 0; i < 3; i++) {
      state = gameReducer(state, { type: "DISMISS_CARD", id: nonChad[i].id });
    }
    expect(state.phase).toBe("browsing");
  });
});

describe("initializeGame", () => {
  it("places chadcluff as the 4th card (index 3)", () => {
    const state = initializeGame();
    expect(state.cards[3].id).toBe("chadcluff");
  });

  it("includes 7 cards (6 random celebrities + chadcluff)", () => {
    const state = initializeGame();
    expect(state.cards.length).toBe(7);
    expect(state.cards.filter((c) => c.isChad).length).toBe(1);
    expect(state.cards.filter((c) => !c.isChad).length).toBe(6);
  });

  it("dismissed set starts empty", () => {
    const state = initializeGame();
    expect(state.dismissed.size).toBe(0);
  });
});
