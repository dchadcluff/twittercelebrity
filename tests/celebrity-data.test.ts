import { describe, it, expect } from "vitest";
import { CELEBRITIES } from "../app/data/celebrities";
import { CHADCLUFF } from "../app/data/chadcluff";
import { existsSync } from "fs";
import { resolve } from "path";
import { readFileSync } from "fs";

describe("Celebrity Data", () => {
  it("has exactly 14 celebrity entries", () => {
    expect(CELEBRITIES).toHaveLength(14);
  });

  it("every celebrity has isChad === false", () => {
    CELEBRITIES.forEach((c) => {
      expect(c.isChad).toBe(false);
    });
  });

  it("includes Elon Musk", () => {
    const elon = CELEBRITIES.find((c) => c.id === "elon-musk");
    expect(elon).toBeDefined();
    expect(elon!.handle).toBe("@elonmusk");
  });

  it("contains no political figures", () => {
    const politicalNames = [
      "trump", "biden", "obama", "clinton", "pelosi",
      "mcconnell", "desantis", "newsom", "aoc", "harris",
    ];
    CELEBRITIES.forEach((c) => {
      const lower = (c.displayName + " " + c.id + " " + c.handle).toLowerCase();
      politicalNames.forEach((name) => {
        expect(lower).not.toContain(name);
      });
    });
  });

  it("every celebrity has all required fields non-empty", () => {
    CELEBRITIES.forEach((c) => {
      expect(c.id).toBeTruthy();
      expect(c.handle).toBeTruthy();
      expect(c.displayName).toBeTruthy();
      expect(c.bio).toBeTruthy();
      expect(c.followerCount).toBeTruthy();
      expect(c.photoPath).toBeTruthy();
    });
  });

  it("every photoPath uses local path format", () => {
    CELEBRITIES.forEach((c) => {
      expect(c.photoPath).toMatch(/^\/images\/celebrities\/.*\.jpg$/);
      expect(c.photoPath).not.toContain("twimg.com");
      expect(c.photoPath).not.toContain("http");
    });
  });

  it("all 15 celebrity image files exist on disk", () => {
    const allCards = [...CELEBRITIES, CHADCLUFF];
    allCards.forEach((c) => {
      const imgPath = resolve(__dirname, "..", "public", c.photoPath.slice(1));
      expect(existsSync(imgPath), `Missing image: ${c.photoPath}`).toBe(true);
    });
  });
});

describe("Chadcluff Data", () => {
  it("has isChad === true", () => {
    expect(CHADCLUFF.isChad).toBe(true);
  });

  it("has id 'chadcluff'", () => {
    expect(CHADCLUFF.id).toBe("chadcluff");
  });

  it("has handle '@chadcluff'", () => {
    expect(CHADCLUFF.handle).toBe("@chadcluff");
  });
});

describe("Cyberpunk Design Tokens", () => {
  it("app.css contains required cyberpunk color tokens", () => {
    const css = readFileSync(resolve(__dirname, "..", "app", "styles", "app.css"), "utf-8");
    expect(css).toContain("--color-neon-cyan");
    expect(css).toContain("--color-neon-pink");
    expect(css).toContain("--color-neon-yellow");
    expect(css).toContain("--color-cyber-black");
    expect(css).toContain("@theme");
    expect(css).toContain('@import "tailwindcss"');
  });
});
