import { jest } from "@jest/globals";

const incr = jest.fn();
const expire = jest.fn();
const ttl = jest.fn();

jest.unstable_mockModule("../config/redis.js", () => ({
  default: {
    incr,
    expire,
    ttl,
  },
}));

const { default: rateLimiter } =
  await import("../middleware/rateLimiter.middleware.js");

describe("Rate Limiter Middleware", () => {
  const createResponse = () => ({
    setHeader: jest.fn(),
  });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("should allow request within rate limit", async () => {
    incr.mockResolvedValue(1);
    expire.mockResolvedValue(1);
    ttl.mockResolvedValue(60);

    const req = {
      apiKey: {
        id: "key-123",
      },
      ip: "127.0.0.1",
    };

    const res = createResponse();
    const next = jest.fn();

    await rateLimiter(req, res, next);

    expect(incr).toHaveBeenCalledWith("ratelimit:key-123");
    expect(expire).toHaveBeenCalledWith(
      "ratelimit:key-123",
      60
    );
    expect(ttl).toHaveBeenCalledWith("ratelimit:key-123");

    expect(res.setHeader).toHaveBeenCalledWith(
      "X-RateLimit-Limit",
      5
    );

    expect(res.setHeader).toHaveBeenCalledWith(
      "X-RateLimit-Remaining",
      4
    );

    expect(res.setHeader).toHaveBeenCalledWith(
      "Retry-After",
      60
    );

    expect(next).toHaveBeenCalledTimes(1);
    expect(next).toHaveBeenCalledWith();
  });

  test("should use IP when API key is not available", async () => {
    incr.mockResolvedValue(1);
    expire.mockResolvedValue(1);
    ttl.mockResolvedValue(60);

    const req = {
      ip: "192.168.1.10",
    };

    const res = createResponse();
    const next = jest.fn();

    await rateLimiter(req, res, next);

    expect(incr).toHaveBeenCalledWith(
      "ratelimit:192.168.1.10"
    );

    expect(next).toHaveBeenCalledWith();
  });

  test("should not reset expiry after the first request", async () => {
    incr.mockResolvedValue(2);
    ttl.mockResolvedValue(59);

    const req = {
      apiKey: {
        id: "key-123",
      },
    };

    const res = createResponse();
    const next = jest.fn();

    await rateLimiter(req, res, next);

    expect(incr).toHaveBeenCalledWith("ratelimit:key-123");

    expect(expire).not.toHaveBeenCalled();

    expect(res.setHeader).toHaveBeenCalledWith(
      "X-RateLimit-Remaining",
      3
    );

    expect(res.setHeader).toHaveBeenCalledWith(
      "Retry-After",
      59
    );

    expect(next).toHaveBeenCalledWith();
  });

  test("should allow the fifth request", async () => {
    incr.mockResolvedValue(5);
    ttl.mockResolvedValue(30);

    const req = {
      apiKey: {
        id: "key-123",
      },
    };

    const res = createResponse();
    const next = jest.fn();

    await rateLimiter(req, res, next);

    expect(res.setHeader).toHaveBeenCalledWith(
      "X-RateLimit-Remaining",
      0
    );

    expect(next).toHaveBeenCalledTimes(1);
    expect(next).toHaveBeenCalledWith();
  });

  test("should reject request after rate limit is exceeded", async () => {
    incr.mockResolvedValue(6);
    ttl.mockResolvedValue(25);

    const req = {
      apiKey: {
        id: "key-123",
      },
    };

    const res = createResponse();
    const next = jest.fn();

    await rateLimiter(req, res, next);

    expect(res.setHeader).toHaveBeenCalledWith(
      "X-RateLimit-Limit",
      5
    );

    expect(res.setHeader).toHaveBeenCalledWith(
      "X-RateLimit-Remaining",
      0
    );

    expect(res.setHeader).toHaveBeenCalledWith(
      "Retry-After",
      25
    );

    expect(next).toHaveBeenCalledTimes(1);

    const error = next.mock.calls[0][0];

    expect(error.statusCode).toBe(429);
    expect(error.message).toBe(
      "Rate limit exceeded. Try again later."
    );
  });

  test("should fail-open gracefully on Redis errors", async () => {
    incr.mockRejectedValue(new Error("Redis connection failed"));

    const req = {
      apiKey: {
        id: "key-123",
      },
    };

    const res = createResponse();
    const next = jest.fn();

    await rateLimiter(req, res, next);

    expect(res.setHeader).toHaveBeenCalledWith("X-RateLimit-Degraded", "true");
    expect(next).toHaveBeenCalledTimes(1);
    expect(next).toHaveBeenCalledWith();
  });
});
