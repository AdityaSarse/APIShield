import { jest } from "@jest/globals";

const createProxyMiddleware = jest.fn();

jest.unstable_mockModule("http-proxy-middleware", () => ({
  createProxyMiddleware,
}));

const loadProxyFactory = async () => {
  jest.resetModules();

  return await import("../modules/gateway/proxyFactory.js");
};

describe("Gateway Proxy Factory", () => {
  beforeEach(() => {
    jest.clearAllMocks();

    createProxyMiddleware.mockImplementation((options) => options);
  });

  test("should create a proxy for a registered service", async () => {
    const { getServiceProxy } = await loadProxyFactory();

    const proxy = getServiceProxy("users");

    expect(createProxyMiddleware).toHaveBeenCalledTimes(1);

    expect(proxy).toBeDefined();
    expect(proxy.target).toBe(
      "http://host.docker.internal:8000"
    );
    expect(proxy.changeOrigin).toBe(true);
  });

  test("should throw 404 for an unknown service", async () => {
    const { getServiceProxy } = await loadProxyFactory();

    expect(() => {
      getServiceProxy("unknown");
    }).toThrow("Service not found");

    try {
      getServiceProxy("unknown");
    } catch (error) {
      expect(error.statusCode).toBe(404);
      expect(error.message).toBe("Service not found");
    }
  });

  test("should cache proxy for the same service", async () => {
    const { getServiceProxy } = await loadProxyFactory();

    const firstProxy = getServiceProxy("products");
    const secondProxy = getServiceProxy("products");

    expect(firstProxy).toBe(secondProxy);
    expect(createProxyMiddleware).toHaveBeenCalledTimes(1);
  });

  test("should create separate proxies for different services", async () => {
    const { getServiceProxy } = await loadProxyFactory();

    const usersProxy = getServiceProxy("users");
    const ordersProxy = getServiceProxy("orders");

    expect(usersProxy).not.toBe(ordersProxy);

    expect(createProxyMiddleware).toHaveBeenCalledTimes(2);
  });

  test("should rewrite root path correctly", async () => {
    const { getServiceProxy } = await loadProxyFactory();

    const proxy = getServiceProxy("users");

    expect(proxy.pathRewrite("/")).toBe("/users");
  });

  test("should rewrite non-root path correctly", async () => {
    const { getServiceProxy } = await loadProxyFactory();

    const proxy = getServiceProxy("users");

    expect(proxy.pathRewrite("/profile")).toBe(
      "/users/profile"
    );

    expect(proxy.pathRewrite("/123")).toBe(
      "/users/123"
    );
  });

  test("should configure proxy error handler", async () => {
    const { getServiceProxy } = await loadProxyFactory();

    const proxy = getServiceProxy("orders");

    expect(proxy.on).toBeDefined();
    expect(proxy.on.error).toBeDefined();
  });

  test("should return 502 when target service is unreachable", async () => {
    const { getServiceProxy } = await loadProxyFactory();

    const proxy = getServiceProxy("products");

    const res = {
      headersSent: false,
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnThis(),
    };

    const error = new Error("ECONNREFUSED");

    const consoleError = jest
      .spyOn(console, "error")
      .mockImplementation(() => {});

    proxy.on.error(error, {}, res);

    expect(res.status).toHaveBeenCalledWith(502);

    expect(res.json).toHaveBeenCalledWith({
      success: false,
      statusCode: 502,
      message:
        "Target service 'products' is unreachable at http://host.docker.internal:8001",
    });

    expect(consoleError).toHaveBeenCalled();

    consoleError.mockRestore();
  });

  test("should not send 502 when response headers are already sent", async () => {
    const { getServiceProxy } = await loadProxyFactory();

    const proxy = getServiceProxy("orders");

    const res = {
      headersSent: true,
      status: jest.fn(),
      json: jest.fn(),
    };

    const consoleError = jest
      .spyOn(console, "error")
      .mockImplementation(() => {});

    proxy.on.error(
      new Error("Connection refused"),
      {},
      res
    );

    expect(res.status).not.toHaveBeenCalled();
    expect(res.json).not.toHaveBeenCalled();

    consoleError.mockRestore();
  });
});
