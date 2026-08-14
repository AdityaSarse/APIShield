import { jest } from "@jest/globals";

const prismaMock = {
  requestLog: {
    count: jest.fn(),
    aggregate: jest.fn(),
    groupBy: jest.fn(),
    findMany: jest.fn(),
  },

  apiKey: {
    count: jest.fn(),
    findMany: jest.fn(),
  },

  $queryRaw: jest.fn(),
};

const redisMock = {
  ping: jest.fn(),
};

jest.unstable_mockModule("../config/prisma.js", () => ({
  default: prismaMock,
}));

jest.unstable_mockModule("../config/redis.js", () => ({
  default: redisMock,
}));

const {
  getAnalyticsSummary,
  getStatusCodeAnalytics,
  getServiceAnalytics,
  getTopApiKeysAnalytics,
  getResponseTimeAnalytics,
  getDailyRequestAnalytics,
  getErrorRateAnalytics,
  getGatewayMonitoring,
} = await import("../modules/analytics/analytics.service.js");

describe("Analytics Service", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("getAnalyticsSummary", () => {
    test("should return analytics summary", async () => {
      prismaMock.requestLog.count
        .mockResolvedValueOnce(17)
        .mockResolvedValueOnce(9)
        .mockResolvedValueOnce(8);

      prismaMock.requestLog.aggregate.mockResolvedValueOnce({
        _avg: {
          responseTime: 101.35,
        },
      });

      prismaMock.apiKey.count.mockResolvedValueOnce(2);

      const result = await getAnalyticsSummary();

      expect(result).toEqual({
        totalRequests: 17,
        successfulRequests: 9,
        failedRequests: 8,
        averageResponseTime: 101.35,
        activeApiKeys: 2,
      });
    });
  });

  describe("getStatusCodeAnalytics", () => {
    test("should return status code counts", async () => {
      prismaMock.requestLog.groupBy.mockResolvedValueOnce([
        {
          statusCode: 200,
          _count: {
            statusCode: 9,
          },
        },
        {
          statusCode: 404,
          _count: {
            statusCode: 3,
          },
        },
        {
          statusCode: 502,
          _count: {
            statusCode: 5,
          },
        },
      ]);

      const result = await getStatusCodeAnalytics();

      expect(result).toEqual([
        {
          statusCode: 200,
          count: 9,
        },
        {
          statusCode: 404,
          count: 3,
        },
        {
          statusCode: 502,
          count: 5,
        },
      ]);
    });
  });

  describe("getServiceAnalytics", () => {
    test("should count requests by gateway service", async () => {
      prismaMock.requestLog.findMany.mockResolvedValueOnce([
        {
          path: "/api/v1/gateway/users",
        },
        {
          path: "/api/v1/gateway/users",
        },
        {
          path: "/api/v1/gateway/products",
        },
        {
          path: "/api/v1/gateway/orders/123",
        },
        {
          path: "/api/v1/auth/login",
        },
      ]);

      const result = await getServiceAnalytics();

      expect(result).toHaveLength(3);

      expect(result).toEqual(
        expect.arrayContaining([
          {
            service: "users",
            count: 2,
          },
          {
            service: "products",
            count: 1,
          },
          {
            service: "orders",
            count: 1,
          },
        ])
      );
    });
  });

  describe("getTopApiKeysAnalytics", () => {
    test("should return API keys ordered by request count", async () => {
      prismaMock.requestLog.groupBy.mockResolvedValueOnce([
        {
          apiKeyId: "key-1",
          _count: {
            apiKeyId: 10,
          },
        },
        {
          apiKeyId: "key-2",
          _count: {
            apiKeyId: 5,
          },
        },
      ]);

      prismaMock.apiKey.findMany.mockResolvedValueOnce([
        {
          id: "key-1",
          prefix: "aps_live_key1",
        },
        {
          id: "key-2",
          prefix: "aps_live_key2",
        },
      ]);

      const result = await getTopApiKeysAnalytics();

      expect(result).toEqual([
        {
          apiKeyId: "key-1",
          keyPrefix: "aps_live_key1",
          requestCount: 10,
        },
        {
          apiKeyId: "key-2",
          keyPrefix: "aps_live_key2",
          requestCount: 5,
        },
      ]);
    });
  });

  describe("getResponseTimeAnalytics", () => {
    test("should return response time statistics", async () => {
      prismaMock.requestLog.aggregate.mockResolvedValueOnce({
        _count: {
          id: 17,
        },
        _avg: {
          responseTime: 101.35,
        },
        _min: {
          responseTime: 10,
        },
        _max: {
          responseTime: 500,
        },
      });

      const result = await getResponseTimeAnalytics();

      expect(result).toEqual({
        totalRequests: 17,
        averageResponseTime: 101.35,
        minimumResponseTime: 10,
        maximumResponseTime: 500,
      });
    });
  });

  describe("getDailyRequestAnalytics", () => {
    test("should return daily request counts", async () => {
      prismaMock.requestLog.findMany.mockResolvedValueOnce([
        {
          createdAt: new Date("2026-08-13T10:00:00.000Z"),
        },
        {
          createdAt: new Date("2026-08-13T11:00:00.000Z"),
        },
        {
          createdAt: new Date("2026-08-14T10:00:00.000Z"),
        },
      ]);

      const result = await getDailyRequestAnalytics();

      expect(result).toEqual([
        {
          date: "2026-08-13",
          count: 2,
        },
        {
          date: "2026-08-14",
          count: 1,
        },
      ]);
    });
  });

  describe("getErrorRateAnalytics", () => {
    test("should calculate error rate", async () => {
      prismaMock.requestLog.count
        .mockResolvedValueOnce(17)
        .mockResolvedValueOnce(9)
        .mockResolvedValueOnce(8);

      const result = await getErrorRateAnalytics();

      expect(result).toEqual({
        totalRequests: 17,
        successfulRequests: 9,
        failedRequests: 8,
        errorRate: 47.06,
      });
    });

    test("should return zero error rate when there are no requests", async () => {
      prismaMock.requestLog.count
        .mockResolvedValueOnce(0)
        .mockResolvedValueOnce(0)
        .mockResolvedValueOnce(0);

      const result = await getErrorRateAnalytics();

      expect(result).toEqual({
        totalRequests: 0,
        successfulRequests: 0,
        failedRequests: 0,
        errorRate: 0,
      });
    });
  });

  describe("getGatewayMonitoring", () => {
    test("should return healthy gateway monitoring data", async () => {
      prismaMock.$queryRaw.mockResolvedValueOnce([{ "?column?": 1 }]);

      redisMock.ping.mockResolvedValueOnce("PONG");

      prismaMock.requestLog.count
        .mockResolvedValueOnce(17)
        .mockResolvedValueOnce(2);

      prismaMock.requestLog.aggregate.mockResolvedValueOnce({
        _avg: {
          responseTime: 101.35,
        },
      });

      const result = await getGatewayMonitoring();

      expect(result.gateway.status).toBe("healthy");

      expect(result.database.status).toBe("connected");
      expect(result.redis.status).toBe("connected");

      expect(result.metrics).toEqual({
        totalRequests: 17,
        recentErrors: 2,
        averageResponseTime: 101.35,
      });

      expect(result.gateway).toHaveProperty("uptime");
      expect(result.gateway).toHaveProperty("checkTime");
    });

    test("should report database as disconnected when database check fails", async () => {
      prismaMock.$queryRaw.mockRejectedValueOnce(
        new Error("Database unavailable")
      );

      redisMock.ping.mockResolvedValueOnce("PONG");

      prismaMock.requestLog.count
        .mockResolvedValueOnce(17)
        .mockResolvedValueOnce(2);

      prismaMock.requestLog.aggregate.mockResolvedValueOnce({
        _avg: {
          responseTime: 100,
        },
      });

      const result = await getGatewayMonitoring();

      expect(result.gateway.status).toBe("unhealthy");
      expect(result.database.status).toBe("disconnected");
      expect(result.redis.status).toBe("connected");
    });

    test("should report redis as disconnected when redis check fails", async () => {
      prismaMock.$queryRaw.mockResolvedValueOnce([{ "?column?": 1 }]);

      redisMock.ping.mockRejectedValueOnce(
        new Error("Redis unavailable")
      );

      prismaMock.requestLog.count
        .mockResolvedValueOnce(17)
        .mockResolvedValueOnce(2);

      prismaMock.requestLog.aggregate.mockResolvedValueOnce({
        _avg: {
          responseTime: 100,
        },
      });

      const result = await getGatewayMonitoring();

      expect(result.gateway.status).toBe("degraded");
      expect(result.database.status).toBe("connected");
      expect(result.redis.status).toBe("disconnected");
    });
  });
});
