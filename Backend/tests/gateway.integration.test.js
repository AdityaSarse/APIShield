import { jest } from "@jest/globals";
import request from "supertest";

const proxyRequest = jest.fn();

jest.unstable_mockModule(
  "../modules/gateway/gateway.repository.js",
  () => ({
    createRequestLog: jest.fn().mockResolvedValue({}),
  })
);

jest.unstable_mockModule(
  "../modules/gateway/gateway.controller.js",
  () => ({
    gatewayHealth: jest.fn(),
    proxyRequest,
  })
);

jest.unstable_mockModule(
  "../middleware/apiKey.middleware.js",
  () => ({
    default: (req, res, next) => {
      req.apiKey = {
        id: "key-123",
        prefix: "aps_live_test",
        lastUsedAt: new Date(),
      };

      req.user = {
        id: "user-123",
        email: "test@example.com",
        role: "developer",
      };

      next();
    },
  })
);

jest.unstable_mockModule(
  "../middleware/rateLimiter.middleware.js",
  () => ({
    default: (req, res, next) => {
      res.setHeader("X-RateLimit-Limit", "5");
      res.setHeader("X-RateLimit-Remaining", "4");
      next();
    },
  })
);

const { default: app } = await import("../app.js");

describe("Gateway Service Proxy Integration", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("should route users service request to proxy controller", async () => {
    proxyRequest.mockImplementation((req, res) => {
      return res.status(200).json({
        success: true,
        service: "users",
        message: "Request proxied successfully",
      });
    });

    const response = await request(app)
      .get("/api/v1/gateway/users");

    expect(response.status).toBe(200);

    expect(response.body).toEqual({
      success: true,
      service: "users",
      message: "Request proxied successfully",
    });

    expect(proxyRequest).toHaveBeenCalledTimes(1);

    const req = proxyRequest.mock.calls[0][0];

    expect(req.params.service).toBe("users");
  });

  test("should route products service request", async () => {
    proxyRequest.mockImplementation((req, res) => {
      return res.status(200).json({
        success: true,
        service: req.params.service,
      });
    });

    const response = await request(app)
      .get("/api/v1/gateway/products");

    expect(response.status).toBe(200);
    expect(response.body.service).toBe("products");

    expect(proxyRequest).toHaveBeenCalledTimes(1);
  });

  test("should route orders service request", async () => {
    proxyRequest.mockImplementation((req, res) => {
      return res.status(200).json({
        success: true,
        service: req.params.service,
      });
    });

    const response = await request(app)
      .get("/api/v1/gateway/orders");

    expect(response.status).toBe(200);
    expect(response.body.service).toBe("orders");

    expect(proxyRequest).toHaveBeenCalledTimes(1);
  });

  test("should preserve rate limit headers", async () => {
    proxyRequest.mockImplementation((req, res) => {
      return res.status(200).json({
        success: true,
      });
    });

    const response = await request(app)
      .get("/api/v1/gateway/users");

    expect(response.headers["x-ratelimit-limit"]).toBe("5");
    expect(response.headers["x-ratelimit-remaining"]).toBe("4");
  });
});
