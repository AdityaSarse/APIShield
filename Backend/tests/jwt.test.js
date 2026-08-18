import {
  generateAccessToken,
  generateRefreshToken,
  verifyAccessToken,
  verifyRefreshToken,
} from "../utils/jwt.js";

describe("JWT Utilities", () => {
  const payload = {
    id: "user-123",
    email: "test@example.com",
    role: "developer",
  };

  describe("Access Token", () => {
    test("should generate an access token", () => {
      const token = generateAccessToken(payload);

      expect(typeof token).toBe("string");
      expect(token.split(".")).toHaveLength(3);
    });

    test("should verify a valid access token", () => {
      const token = generateAccessToken(payload);

      const decoded = verifyAccessToken(token);

      expect(decoded.id).toBe(payload.id);
      expect(decoded.email).toBe(payload.email);
      expect(decoded.role).toBe(payload.role);
    });

    test("should reject an invalid access token", () => {
      expect(() => {
        verifyAccessToken("invalid-token");
      }).toThrow();
    });
  });

  describe("Refresh Token", () => {
    test("should generate a refresh token", () => {
      const token = generateRefreshToken(payload);

      expect(typeof token).toBe("string");
      expect(token.split(".")).toHaveLength(3);
    });

    test("should verify a valid refresh token", () => {
      const token = generateRefreshToken(payload);

      const decoded = verifyRefreshToken(token);

      expect(decoded.id).toBe(payload.id);
      expect(decoded.email).toBe(payload.email);
      expect(decoded.role).toBe(payload.role);
    });

    test("should reject an invalid refresh token", () => {
      expect(() => {
        verifyRefreshToken("invalid-token");
      }).toThrow();
    });

    test("should not verify an access token as a refresh token", () => {
      const accessToken = generateAccessToken(payload);

      expect(() => {
        verifyRefreshToken(accessToken);
      }).toThrow();
    });

    test("should not verify a refresh token as an access token", () => {
      const refreshToken = generateRefreshToken(payload);

      expect(() => {
        verifyAccessToken(refreshToken);
      }).toThrow();
    });
  });
});
