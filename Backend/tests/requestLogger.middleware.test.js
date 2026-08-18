import { jest } from "@jest/globals";

const createRequestLog = jest.fn();

jest.unstable_mockModule(
  "../modules/gateway/gateway.repository.js",
  () => ({
    createRequestLog,
  })
);

const { default: requestLogger } =
  await import("../middleware/requestLogger.middleware.js");

describe("Request Logger Middleware", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  const createResponse = () => {
    const handlers = {};

    return {
      statusCode: 200,

      on: jest.fn((event, callback) => {
        handlers[event] = callback;
      }),

      getFinishHandler: () => handlers.finish,
    };
  };

  test("should call next immediately", () => {
    const req = {
      method: "GET",
      originalUrl: "/api/v1/gateway/users",
      ip: "127.0.0.1",
      get: jest.fn().mockReturnValue("Jest"),
      apiKey: {
        id: "key-123",
      },
    };

    const res = createResponse();
    const next = jest.fn();

    requestLogger(req, res, next);

    expect(next).toHaveBeenCalledTimes(1);
    expect(next).toHaveBeenCalledWith();
  });

  test("should register a finish event listener", () => {
    const req = {
      method: "GET",
      originalUrl: "/api/v1/gateway/users",
      ip: "127.0.0.1",
      get: jest.fn().mockReturnValue("Jest"),
      apiKey: {
        id: "key-123",
      },
    };

    const res = createResponse();
    const next = jest.fn();

    requestLogger(req, res, next);

    expect(res.on).toHaveBeenCalledWith(
      "finish",
      expect.any(Function)
    );
  });

  test("should create request log when response finishes", async () => {
    const req = {
      method: "GET",
      originalUrl: "/api/v1/gateway/users",
      ip: "127.0.0.1",
      get: jest.fn().mockReturnValue("Jest"),
      apiKey: {
        id: "key-123",
      },
    };

    const res = createResponse();
    const next = jest.fn();

    createRequestLog.mockResolvedValue({});

    requestLogger(req, res, next);

    const finishHandler = res.getFinishHandler();

    await finishHandler();

    expect(createRequestLog).toHaveBeenCalledTimes(1);

    expect(createRequestLog).toHaveBeenCalledWith(
      expect.objectContaining({
        method: "GET",
        path: "/api/v1/gateway/users",
        statusCode: 200,
        ipAddress: "127.0.0.1",
        userAgent: "Jest",
        apiKeyId: "key-123",
      })
    );
  });

  test("should use req.url when originalUrl is unavailable", async () => {
    const req = {
      method: "POST",
      url: "/users",
      ip: "127.0.0.1",
      get: jest.fn().mockReturnValue("Jest"),
      apiKey: {
        id: "key-456",
      },
    };

    const res = createResponse();
    const next = jest.fn();

    createRequestLog.mockResolvedValue({});

    requestLogger(req, res, next);

    await res.getFinishHandler()();

    expect(createRequestLog).toHaveBeenCalledWith(
      expect.objectContaining({
        path: "/users",
      })
    );
  });

  test("should handle request logging errors without breaking the request", async () => {
    const consoleError = jest
      .spyOn(console, "error")
      .mockImplementation(() => {});

    const req = {
      method: "GET",
      originalUrl: "/api/v1/gateway/users",
      ip: "127.0.0.1",
      get: jest.fn().mockReturnValue("Jest"),
      apiKey: {
        id: "key-123",
      },
    };

    const res = createResponse();
    const next = jest.fn();

    createRequestLog.mockRejectedValue(
      new Error("Database logging failed")
    );

    requestLogger(req, res, next);

    expect(next).toHaveBeenCalledTimes(1);

    await res.getFinishHandler()();

    expect(consoleError).toHaveBeenCalledWith(
      "Failed to log request:",
      expect.any(Error)
    );

    consoleError.mockRestore();
  });
});
