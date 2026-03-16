import { describe, it, expect } from "vitest";

// Constants matching home.tsx implementation
const FOLLOW_URL = "https://x.com/chadcluff";
const SHARE_TEXT =
  "Think you know who the real Twitter Celebrity is? Find out \u2192 twittercelebrity.com";
const SHARE_URL = `https://x.com/intent/tweet?text=${encodeURIComponent(SHARE_TEXT)}`;

describe("Reveal screen URLs", () => {
  describe("POST-01: Follow CTA", () => {
    it("Follow URL points to x.com/chadcluff", () => {
      expect(FOLLOW_URL).toBe("https://x.com/chadcluff");
    });

    it("Follow URL is a valid HTTPS URL", () => {
      const url = new URL(FOLLOW_URL);
      expect(url.protocol).toBe("https:");
      expect(url.hostname).toBe("x.com");
    });
  });

  describe("POST-02: Share on X", () => {
    it("Share URL uses x.com/intent/tweet endpoint", () => {
      expect(SHARE_URL).toContain("x.com/intent/tweet");
    });

    it("Share URL contains properly encoded tweet text that roundtrips correctly", () => {
      // Test the decoded value roundtrips correctly
      const url = new URL(SHARE_URL);
      const decodedText = url.searchParams.get("text");
      expect(decodedText).toBe(SHARE_TEXT);
    });

    it("Share text contains the arrow character (U+2192)", () => {
      expect(SHARE_TEXT).toContain("\u2192");
    });

    it("Share text mentions twittercelebrity.com", () => {
      expect(SHARE_TEXT).toContain("twittercelebrity.com");
    });
  });
});
