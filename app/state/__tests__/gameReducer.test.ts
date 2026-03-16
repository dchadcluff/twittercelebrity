import { describe, it, expect } from "vitest";
import { gameReducer, initializeGame } from "../gameReducer";
import { CELEBRITIES } from "../../data/celebrities";

describe("gameReducer", () => {
  it("DISMISS_CARD removes card from dismissed set — dismissed.has(id) === true after dispatch", () => {
    const state = initializeGame();
    const cardId = CELEBRITIES[0].id;
    const next = gameReducer(state, { type: "DISMISS_CARD", id: cardId });
    expect(next.dismissed.has(cardId)).toBe(true);
  });

  it("DISMISS_CARD for isChad card is ignored — dismissed set unchanged", () => {
    const state = initializeGame();
    const next = gameReducer(state, { type: "DISMISS_CARD", id: "chadcluff" });
    expect(next.dismissed.size).toBe(0);
  });

  it("Phase transitions to 'reveal' when all 14 non-chad cards are dismissed", () => {
    let state = initializeGame();
    for (const celebrity of CELEBRITIES) {
      state = gameReducer(state, { type: "DISMISS_CARD", id: celebrity.id });
    }
    expect(state.phase).toBe("reveal");
  });

  it("Phase stays 'browsing' when only some non-chad cards are dismissed", () => {
    let state = initializeGame();
    // Dismiss only 5 cards
    for (let i = 0; i < 5; i++) {
      state = gameReducer(state, { type: "DISMISS_CARD", id: CELEBRITIES[i].id });
    }
    expect(state.phase).toBe("browsing");
  });
});

describe("initializeGame", () => {
  it("places chadcluff as the 7th card (index 6)", () => {
    const state = initializeGame();
    expect(state.cards[6].id).toBe("chadcluff");
  });

  it("includes all 15 cards (14 celebrities + chadcluff)", () => {
    const state = initializeGame();
    expect(state.cards.length).toBe(15);
  });

  it("dismissed set starts empty", () => {
    const state = initializeGame();
    expect(state.dismissed.size).toBe(0);
  });
});
