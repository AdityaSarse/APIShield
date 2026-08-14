import { jest } from "@jest/globals";

const getServiceProxy = jest.fn();

jest.unstable_mockModule(
  "../modules/gateway/proxyFactory.js",
  () => ({
    getServiceProxy,
  })
);

const {
  gatewayHealth,
  proxyRequest,
} = await import("../modules/gateway/gateway.controller.js");

describe("Gateway Controller", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  const createResponse = () => {
    const res = {};

    res.status = jest.fn().mockReturnValue(res);
    res.json = jest.fn().mockReturnValue(res);

    return res;
  };

  describe("gatewayHealth", () => {
    test("should return gateway health information", () => {
      const req = {
        user: {
          id: "user-123",
          email: "test@example.com",
          role: "developer",
        },
        apiKey: {
          id: "key-123",
          prefix: "aps_live_123",
          lastUsedAt: new Date(),
        },
      };

      const res = createResponse();

      gatewayHealth(req, res);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledTimes(1);

      const response = res.json.mock.calls[0][0];

      expect(response.statusCode).toBe(200);
      expect(response.message).toBe("Gateway is running");
      expect(response.data.gateway).toBe("APIShield");

      expect(response.data.authenticatedUser).toEqual({
        id: "user-123",
        email: "test@example.com",
        role: "developer",
      });

      expect(response.data.apiKey).toEqual({
        id: "key-123",
        prefix: "aps_live_123",
        lastUsedAt: req.apiKey.lastUsedAt,
      });
    });
  });

  describe("proxyRequest", () => {
    test("should get the proxy for the requested service", () => {
      const proxy = jest.fn();

      getServiceProxy.mockReturnValue(proxy);

      const req = {
        params: {
          service: "users",
        },
      };

      const res = {};
      const next = jest.fn();

      proxyRequest(req, res, next);

      expect(getServiceProxy).toHaveBeenCalledWith("users");
      expect(proxy).toHaveBeenCalledWith(req, res, next);
    });

    test("should proxy product service requests", () => {
      const proxy = jest.fn();

      getServiceProxy.mockReturnValue(proxy);

      const req = {
        params: {
          service: "products",
        },
      };

      const res = {};
      const next = jest.fn();

      proxyRequest(req, res, next);

      expect(getServiceProxy).toHaveBeenCalledWith("products");
      expect(proxy).toHaveBeenCalledWith(req, res, next);
    });

    test("should propagate proxy factory errors", () => {
      const error = new Error("Service not found");

      getServiceProxy.mockImplementation(() => {
        throw error;
      });

      const req = {
        params: {
          service: "unknown",
        },
      };

      const res = {};
      const next = jest.fn();

      expect(() => {
        proxyRequest(req, res, next);
      }).toThrow(error);

      expect(getServiceProxy).toHaveBeenCalledWith("unknown");
      expect(next).not.toHaveBeenCalled();
    });
  });
});
