import { jest } from "@jest/globals";

const findApiKeyById = jest.fn();

jest.unstable_mockModule(
  "../modules/apikey/apikey.repository.js",
  () => ({
    findApiKeyById,
  })
);

const { getApiKeyDetails } =
  await import(
    "../modules/apikey/services/getKeyDetails.service.js"
  );

describe("Get API Key Details Service", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("should return API key details for the user", async () => {
    const apiKey = {
      id: "key-123",
      name: "Production API",
      prefix: "aps_live_123",
      revoked: false,
      expiresAt: null,
    };

    findApiKeyById.mockResolvedValue(apiKey);

    const result = await getApiKeyDetails(
      "key-123",
      "user-123"
    );

    expect(findApiKeyById).toHaveBeenCalledWith(
      "key-123",
      "user-123"
    );

    expect(findApiKeyById).toHaveBeenCalledTimes(1);
    expect(result).toEqual(apiKey);
  });

  test("should throw 404 when API key is not found", async () => {
    findApiKeyById.mockResolvedValue(null);

    await expect(
      getApiKeyDetails("key-999", "user-123")
    ).rejects.toMatchObject({
      statusCode: 404,
      message: "API key not found",
    });

    expect(findApiKeyById).toHaveBeenCalledWith(
      "key-999",
      "user-123"
    );
  });
});
