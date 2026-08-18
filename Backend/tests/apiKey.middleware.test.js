import { jest } from "@jest/globals";

const findApiKeyByHash = jest.fn();
const updateLastUsedAt = jest.fn();

jest.unstable_mockModule("../modules/apikey/apikey.repository.js", () => ({
  findApiKeyByHash,
  updateLastUsedAt,
}));

const { default: authenticateApiKey } =
  await import("../middleware/apiKey.middleware.js");

describe("API Key Authentication Middleware", () => {
  const createRequest = (apiKey) => ({
    header: jest.fn().mockReturnValue(apiKey),
  });

  const createResponse = () => ({});

  beforeEach(() => {
    jest.clearAllMocks();
    updateLastUsedAt.mockResolvedValue(undefined);
  });

  test("should reject request when API key is missing", async () => {
    const req = createRequest(undefined);
    const next = jest.fn();

    await authenticateApiKey(req, createResponse(), next);

    expect(next).toHaveBeenCalledTimes(1);

    const error = next.mock.calls[0][0];

    expect(error.statusCode).toBe(401);
    expect(error.message).toBe("API key is required");
  });

  test("should reject an invalid API key", async () => {
    findApiKeyByHash.mockResolvedValue(null);

    const req = createRequest("aps_live_invalid");
    const next = jest.fn();

    await authenticateApiKey(req, createResponse(), next);

    expect(findApiKeyByHash).toHaveBeenCalledTimes(1);
    expect(next).toHaveBeenCalledTimes(1);

    const error = next.mock.calls[0][0];

    expect(error.statusCode).toBe(401);
    expect(error.message).toBe("Invalid API key");
  });

  test("should reject a revoked API key", async () => {
    findApiKeyByHash.mockResolvedValue({
      id: "key-123",
      revoked: true,
      expiresAt: null,
      user: {
        id: "user-123",
        email: "test@example.com",
        role: "developer",
      },
    });

    const req = createRequest("aps_live_revoked");
    const next = jest.fn();

    await authenticateApiKey(req, createResponse(), next);

    expect(next).toHaveBeenCalledTimes(1);

    const error = next.mock.calls[0][0];

    expect(error.statusCode).toBe(401);
    expect(error.message).toBe("API key has been revoked");
    expect(updateLastUsedAt).not.toHaveBeenCalled();
  });

  test("should reject an expired API key", async () => {
    findApiKeyByHash.mockResolvedValue({
      id: "key-123",
      revoked: false,
      expiresAt: new Date(Date.now() - 60 * 1000),
      user: {
        id: "user-123",
        email: "test@example.com",
        role: "developer",
      },
    });

    const req = createRequest("aps_live_expired");
    const next = jest.fn();

    await authenticateApiKey(req, createResponse(), next);

    expect(next).toHaveBeenCalledTimes(1);

    const error = next.mock.calls[0][0];

    expect(error.statusCode).toBe(401);
    expect(error.message).toBe("API key has expired");
    expect(updateLastUsedAt).not.toHaveBeenCalled();
  });

  test("should authenticate a valid API key", async () => {
    const key = {
      id: "key-123",
      revoked: false,
      expiresAt: new Date(Date.now() + 60 * 60 * 1000),
      prefix: "aps_live_123",
      user: {
        id: "user-123",
        email: "test@example.com",
        role: "developer",
      },
    };

    findApiKeyByHash.mockResolvedValue(key);

    const req = createRequest("aps_live_valid");
    const next = jest.fn();

    await authenticateApiKey(req, createResponse(), next);

    expect(findApiKeyByHash).toHaveBeenCalledTimes(1);
    expect(updateLastUsedAt).toHaveBeenCalledWith("key-123");

    expect(req.apiKey).toBe(key);
    expect(req.user).toBe(key.user);

    expect(next).toHaveBeenCalledTimes(1);
    expect(next).toHaveBeenCalledWith();
  });
});
