import { jest } from "@jest/globals";

const generateKey = jest.fn();
const listApiKeys = jest.fn();
const getApiKeyDetails = jest.fn();
const revokeKey = jest.fn();
const rotateKey = jest.fn();

jest.unstable_mockModule(
  "../modules/apikey/services/generateKey.service.js",
  () => ({
    generateKey,
  })
);

jest.unstable_mockModule(
  "../modules/apikey/services/listKeys.service.js",
  () => ({
    listApiKeys,
  })
);

jest.unstable_mockModule(
  "../modules/apikey/services/getKeyDetails.service.js",
  () => ({
    getApiKeyDetails,
  })
);

jest.unstable_mockModule(
  "../modules/apikey/services/revokeKey.service.js",
  () => ({
    revokeKey,
  })
);

jest.unstable_mockModule(
  "../modules/apikey/services/rotateKey.service.js",
  () => ({
    rotateKey,
  })
);

const {
  createApiKey,
  getApiKeys,
  getApiKey,
  revokeApiKey,
  rotateApiKey,
} = await import("../modules/apikey/apikey.controller.js");

describe("API Key Controller", () => {
  const createResponse = () => {
    const res = {};

    res.status = jest.fn().mockReturnValue(res);
    res.json = jest.fn().mockReturnValue(res);

    return res;
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("createApiKey", () => {
    test("should create an API key", async () => {
      const result = {
        id: "key-123",
        name: "Production API",
        prefix: "aps_live_123",
      };

      generateKey.mockResolvedValue(result);

      const req = {
        validatedData: {
          name: "Production API",
          expiresAt: "2027-01-01T00:00:00.000Z",
        },
        user: {
          id: "user-123",
        },
      };

      const res = createResponse();
      const next = jest.fn();

      await createApiKey(req, res, next);

      expect(generateKey).toHaveBeenCalledWith({
        name: "Production API",
        expiresAt: "2027-01-01T00:00:00.000Z",
        userId: "user-123",
      });

      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledTimes(1);
      expect(next).not.toHaveBeenCalled();
    });

    test("should forward service errors", async () => {
      const error = new Error("Failed to create API key");

      generateKey.mockRejectedValue(error);

      const req = {
        validatedData: {
          name: "Production API",
          expiresAt: null,
        },
        user: {
          id: "user-123",
        },
      };

      const res = createResponse();
      const next = jest.fn();

      await createApiKey(req, res, next);

      expect(next).toHaveBeenCalledWith(error);
    });
  });

  describe("getApiKeys", () => {
    test("should return API keys for the authenticated user", async () => {
      const keys = [
        {
          id: "key-1",
          name: "Production API",
        },
        {
          id: "key-2",
          name: "Development API",
        },
      ];

      listApiKeys.mockResolvedValue(keys);

      const req = {
        user: {
          id: "user-123",
        },
      };

      const res = createResponse();
      const next = jest.fn();

      await getApiKeys(req, res, next);

      expect(listApiKeys).toHaveBeenCalledWith("user-123");
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledTimes(1);
      expect(next).not.toHaveBeenCalled();
    });

    test("should forward service errors", async () => {
      const error = new Error("Database error");

      listApiKeys.mockRejectedValue(error);

      const req = {
        user: {
          id: "user-123",
        },
      };

      const res = createResponse();
      const next = jest.fn();

      await getApiKeys(req, res, next);

      expect(next).toHaveBeenCalledWith(error);
    });
  });

  describe("getApiKey", () => {
    test("should return API key details", async () => {
      const apiKey = {
        id: "key-123",
        name: "Production API",
      };

      getApiKeyDetails.mockResolvedValue(apiKey);

      const req = {
        params: {
          id: "key-123",
        },
        user: {
          id: "user-123",
        },
      };

      const res = createResponse();
      const next = jest.fn();

      await getApiKey(req, res, next);

      expect(getApiKeyDetails).toHaveBeenCalledWith(
        "key-123",
        "user-123"
      );

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledTimes(1);
      expect(next).not.toHaveBeenCalled();
    });

    test("should forward service errors", async () => {
      const error = new Error("API key not found");

      getApiKeyDetails.mockRejectedValue(error);

      const req = {
        params: {
          id: "key-123",
        },
        user: {
          id: "user-123",
        },
      };

      const res = createResponse();
      const next = jest.fn();

      await getApiKey(req, res, next);

      expect(next).toHaveBeenCalledWith(error);
    });
  });

  describe("revokeApiKey", () => {
    test("should revoke an API key", async () => {
      const result = {
        id: "key-123",
        revoked: true,
      };

      revokeKey.mockResolvedValue(result);

      const req = {
        params: {
          id: "key-123",
        },
        user: {
          id: "user-123",
        },
      };

      const res = createResponse();
      const next = jest.fn();

      await revokeApiKey(req, res, next);

      expect(revokeKey).toHaveBeenCalledWith(
        "key-123",
        "user-123"
      );

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledTimes(1);
      expect(next).not.toHaveBeenCalled();
    });

    test("should forward revoke errors", async () => {
      const error = new Error("API key already revoked");

      revokeKey.mockRejectedValue(error);

      const req = {
        params: {
          id: "key-123",
        },
        user: {
          id: "user-123",
        },
      };

      const res = createResponse();
      const next = jest.fn();

      await revokeApiKey(req, res, next);

      expect(next).toHaveBeenCalledWith(error);
    });
  });

  describe("rotateApiKey", () => {
    test("should rotate an API key", async () => {
      const result = {
        id: "key-123",
        prefix: "aps_live_new",
      };

      rotateKey.mockResolvedValue(result);

      const req = {
        params: {
          id: "key-123",
        },
        user: {
          id: "user-123",
        },
      };

      const res = createResponse();
      const next = jest.fn();

      await rotateApiKey(req, res, next);

      expect(rotateKey).toHaveBeenCalledWith(
        "key-123",
        "user-123"
      );

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledTimes(1);
      expect(next).not.toHaveBeenCalled();
    });

    test("should forward rotate errors", async () => {
      const error = new Error("Cannot rotate revoked API key");

      rotateKey.mockRejectedValue(error);

      const req = {
        params: {
          id: "key-123",
        },
        user: {
          id: "user-123",
        },
      };

      const res = createResponse();
      const next = jest.fn();

      await rotateApiKey(req, res, next);

      expect(next).toHaveBeenCalledWith(error);
    });
  });
});
