import { jest } from "@jest/globals";

const findApiKeysByUserId = jest.fn();

jest.unstable_mockModule(
  "../modules/apikey/apikey.repository.js",
  () => ({
    findApiKeysByUserId,
  })
);

const { listApiKeys } =
  await import("../modules/apikey/services/listKeys.service.js");

describe("List API Keys Service", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("should return API keys for a user", async () => {
    const keys = [
      {
        id: "key-1",
        name: "Production API",
        prefix: "aps_live_prod",
        revoked: false,
      },
      {
        id: "key-2",
        name: "Development API",
        prefix: "aps_live_dev",
        revoked: false,
      },
    ];

    findApiKeysByUserId.mockResolvedValue(keys);

    const result = await listApiKeys("user-123");

    expect(findApiKeysByUserId).toHaveBeenCalledWith("user-123");
    expect(findApiKeysByUserId).toHaveBeenCalledTimes(1);
    expect(result).toEqual(keys);
  });

  test("should propagate repository errors", async () => {
    const error = new Error("Database error");

    findApiKeysByUserId.mockRejectedValue(error);

    await expect(
      listApiKeys("user-123")
    ).rejects.toThrow("Database error");

    expect(findApiKeysByUserId).toHaveBeenCalledWith("user-123");
  });
});
