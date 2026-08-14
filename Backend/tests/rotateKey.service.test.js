import { jest } from "@jest/globals";

const findApiKeyByIdForUpdate = jest.fn();
const updateApiKey = jest.fn();

const generateApiKey = jest.fn();
const hashApiKey = jest.fn();
const getKeyPrefix = jest.fn();

jest.unstable_mockModule(
  "../modules/apikey/apikey.repository.js",
  () => ({
    findApiKeyByIdForUpdate,
    updateApiKey,
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

const { rotateKey } =
  await import("../modules/apikey/services/rotateKey.service.js");

describe("Rotate API Key Service", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("should rotate an active API key", async () => {
    const newApiKey =
      "aps_live_newabcdefghijklmnopqrstuvwxyz123";

    const updatedKey = {
      id: "key-123",
      name: "Production API",
      prefix: "aps_live_newpref",
      revoked: false,
    };

    findApiKeyByIdForUpdate.mockResolvedValue({
      id: "key-123",
      revoked: false,
    });

    generateApiKey.mockReturnValue(newApiKey);
    hashApiKey.mockReturnValue("new-hashed-api-key");
    getKeyPrefix.mockReturnValue("aps_live_newpref");

    updateApiKey.mockResolvedValue(updatedKey);

    const result = await rotateKey(
      "key-123",
      "user-123"
    );

    expect(findApiKeyByIdForUpdate).toHaveBeenCalledWith(
      "key-123",
      "user-123"
    );

    expect(generateApiKey).toHaveBeenCalledTimes(1);

    expect(hashApiKey).toHaveBeenCalledWith(newApiKey);

    expect(getKeyPrefix).toHaveBeenCalledWith(newApiKey);

    expect(updateApiKey).toHaveBeenCalledWith(
      "key-123",
      {
        keyHash: "new-hashed-api-key",
        prefix: "aps_live_newpref",
      }
    );

    expect(result).toEqual({
      ...updatedKey,
      apiKey: newApiKey,
    });
  });

  test("should throw 404 when API key is not found", async () => {
    findApiKeyByIdForUpdate.mockResolvedValue(null);

    await expect(
      rotateKey("key-999", "user-123")
    ).rejects.toMatchObject({
      statusCode: 404,
      message: "API key not found",
    });

    expect(findApiKeyByIdForUpdate).toHaveBeenCalledWith(
      "key-999",
      "user-123"
    );

    expect(generateApiKey).not.toHaveBeenCalled();
    expect(updateApiKey).not.toHaveBeenCalled();
  });

  test("should throw 400 when API key is revoked", async () => {
    findApiKeyByIdForUpdate.mockResolvedValue({
      id: "key-123",
      revoked: true,
    });

    await expect(
      rotateKey("key-123", "user-123")
    ).rejects.toMatchObject({
      statusCode: 400,
      message: "Cannot rotate a revoked API key",
    });

    expect(generateApiKey).not.toHaveBeenCalled();
    expect(updateApiKey).not.toHaveBeenCalled();
  });
});
