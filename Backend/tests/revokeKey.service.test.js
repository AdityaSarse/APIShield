import { jest } from "@jest/globals";

const findApiKeyByIdForUpdate = jest.fn();
const revokeApiKey = jest.fn();

jest.unstable_mockModule(
  "../modules/apikey/apikey.repository.js",
  () => ({
    findApiKeyByIdForUpdate,
    revokeApiKey,
  })
);

const { revokeKey } =
  await import("../modules/apikey/services/revokeKey.service.js");

describe("Revoke API Key Service", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("should revoke an active API key", async () => {
    const apiKey = {
      id: "key-123",
      revoked: false,
    };

    const revokedKey = {
      id: "key-123",
      name: "Production API",
      revoked: true,
    };

    findApiKeyByIdForUpdate.mockResolvedValue(apiKey);
    revokeApiKey.mockResolvedValue(revokedKey);

    const result = await revokeKey(
      "key-123",
      "user-123"
    );

    expect(findApiKeyByIdForUpdate).toHaveBeenCalledWith(
      "key-123",
      "user-123"
    );

    expect(revokeApiKey).toHaveBeenCalledWith("key-123");
    expect(revokeApiKey).toHaveBeenCalledTimes(1);

    expect(result).toEqual(revokedKey);
  });

  test("should throw 404 when API key is not found", async () => {
    findApiKeyByIdForUpdate.mockResolvedValue(null);

    await expect(
      revokeKey("key-999", "user-123")
    ).rejects.toMatchObject({
      statusCode: 404,
      message: "API key not found",
    });

    expect(findApiKeyByIdForUpdate).toHaveBeenCalledWith(
      "key-999",
      "user-123"
    );

    expect(revokeApiKey).not.toHaveBeenCalled();
  });

  test("should throw 400 when API key is already revoked", async () => {
    findApiKeyByIdForUpdate.mockResolvedValue({
      id: "key-123",
      revoked: true,
    });

    await expect(
      revokeKey("key-123", "user-123")
    ).rejects.toMatchObject({
      statusCode: 400,
      message: "API key is already revoked",
    });

    expect(findApiKeyByIdForUpdate).toHaveBeenCalledWith(
      "key-123",
      "user-123"
    );

    expect(revokeApiKey).not.toHaveBeenCalled();
  });
});
