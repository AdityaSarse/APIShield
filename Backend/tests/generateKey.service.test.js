import { jest } from "@jest/globals";

const createApiKey = jest.fn();

const generateApiKey = jest.fn();
const hashApiKey = jest.fn();
const getKeyPrefix = jest.fn();

jest.unstable_mockModule(
  "../modules/apikey/apikey.repository.js",
  () => ({
    createApiKey,
  })
);

jest.unstable_mockModule(
  "../utils/apiKey.js",
  () => ({
    generateApiKey,
    hashApiKey,
    getKeyPrefix,
  })
);

const { generateKey } =
  await import("../modules/apikey/services/generateKey.service.js");

describe("Generate API Key Service", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("should generate and store a new API key", async () => {
    const created = {
      id: "key-123",
      name: "Production API",
      expiresAt: new Date("2027-01-01T00:00:00.000Z"),
      createdAt: new Date("2026-08-13T00:00:00.000Z"),
    };

    generateApiKey.mockReturnValue(
      "aps_live_abcdefghijklmnopqrstuvwxyz123456"
    );

    hashApiKey.mockReturnValue("hashed-api-key");

    getKeyPrefix.mockReturnValue("aps_live_abcdefgh");

    createApiKey.mockResolvedValue(created);

    const result = await generateKey({
      name: "Production API",
      expiresAt: "2027-01-01T00:00:00.000Z",
      userId: "user-123",
    });

    expect(generateApiKey).toHaveBeenCalledTimes(1);

    expect(hashApiKey).toHaveBeenCalledWith(
      "aps_live_abcdefghijklmnopqrstuvwxyz123456"
    );

    expect(getKeyPrefix).toHaveBeenCalledWith(
      "aps_live_abcdefghijklmnopqrstuvwxyz123456"
    );

    expect(createApiKey).toHaveBeenCalledWith({
      name: "Production API",
      keyHash: "hashed-api-key",
      prefix: "aps_live_abcdefgh",
      userId: "user-123",
      expiresAt: new Date("2027-01-01T00:00:00.000Z"),
    });

    expect(result).toEqual({
      id: "key-123",
      name: "Production API",
      apiKey: "aps_live_abcdefghijklmnopqrstuvwxyz123456",
      expiresAt: created.expiresAt,
      createdAt: created.createdAt,
    });
  });

  test("should store null expiration when expiresAt is not provided", async () => {
    const created = {
      id: "key-456",
      name: "Development API",
      expiresAt: null,
      createdAt: new Date("2026-08-13T00:00:00.000Z"),
    };

    generateApiKey.mockReturnValue(
      "aps_live_testabcdefghijklmnopqrstuvwxyz123"
    );

    hashApiKey.mockReturnValue("hashed-development-key");
    getKeyPrefix.mockReturnValue("aps_live_testpref");

    createApiKey.mockResolvedValue(created);

    const result = await generateKey({
      name: "Development API",
      userId: "user-456",
    });

    expect(createApiKey).toHaveBeenCalledWith({
      name: "Development API",
      keyHash: "hashed-development-key",
      prefix: "aps_live_testpref",
      userId: "user-456",
      expiresAt: null,
    });

    expect(result.apiKey).toBe(
      "aps_live_testabcdefghijklmnopqrstuvwxyz123"
    );

    expect(result.expiresAt).toBeNull();
  });

  test("should propagate repository errors", async () => {
    const error = new Error("Database error");

    generateApiKey.mockReturnValue(
      "aps_live_testabcdefghijklmnopqrstuvwxyz123"
    );

    hashApiKey.mockReturnValue("hashed-api-key");
    getKeyPrefix.mockReturnValue("aps_live_testpref");

    createApiKey.mockRejectedValue(error);

    await expect(
      generateKey({
        name: "Production API",
        expiresAt: null,
        userId: "user-123",
      })
    ).rejects.toThrow("Database error");
  });
});
