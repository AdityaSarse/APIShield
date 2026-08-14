import {
  generateApiKey,
  hashApiKey,
  getKeyPrefix,
} from "../utils/apiKey.js";

describe("API Key Utilities", () => {
  describe("generateApiKey", () => {
    test("should generate a valid API key", () => {
      const apiKey = generateApiKey();

      expect(apiKey).toMatch(/^aps_live_[A-Za-z0-9]{32}$/);
    });

    test("should generate unique API keys", () => {
      const key1 = generateApiKey();
      const key2 = generateApiKey();

      expect(key1).not.toBe(key2);
    });
  });

  describe("hashApiKey", () => {
    test("should return a SHA-256 hash", () => {
      const apiKey = "aps_live_test123";

      const hash = hashApiKey(apiKey);

      expect(hash).toMatch(/^[a-f0-9]{64}$/);
    });

    test("should return the same hash for the same API key", () => {
      const apiKey = "aps_live_test123";

      expect(hashApiKey(apiKey)).toBe(hashApiKey(apiKey));
    });

    test("should return different hashes for different API keys", () => {
      const hash1 = hashApiKey("aps_live_test123");
      const hash2 = hashApiKey("aps_live_test456");

      expect(hash1).not.toBe(hash2);
    });
  });

  describe("getKeyPrefix", () => {
    test("should return the first 16 characters", () => {
      const apiKey = "aps_live_123456789012345678901234";

      const prefix = getKeyPrefix(apiKey);

      expect(prefix).toBe(apiKey.substring(0, 16));
      expect(prefix).toHaveLength(16);
    });
  });
});
