import prisma from "../../config/prisma.js";
import redis from "../../config/redis.js";
import {
  WINDOW_SIZE_IN_SECONDS,
  MAX_REQUEST_LIMIT,
} from "../../middleware/rateLimiter.middleware.js";
import { serviceRegistry } from "../gateway/serviceRegistry.js";

export const getAnalyticsSummary = async () => {
  const [
    totalRequests,
    successfulRequests,
    failedRequests,
    responseTime,
    activeApiKeys,
  ] = await Promise.all([
    prisma.requestLog.count(),

    prisma.requestLog.count({
      where: {
        statusCode: {
          gte: 200,
          lt: 400,
        },
      },
    }),

    prisma.requestLog.count({
      where: {
        statusCode: {
          gte: 400,
        },
      },
    }),

    prisma.requestLog.aggregate({
      _avg: {
        responseTime: true,
      },
    }),

    prisma.apiKey.count({
      where: {
        revoked: false,
      },
    }),
  ]);

  return {
    totalRequests,
    successfulRequests,
    failedRequests,
    averageResponseTime: responseTime._avg.responseTime ?? 0,
    activeApiKeys,
  };
};

export const getStatusCodeAnalytics = async () => {
  const results = await prisma.requestLog.groupBy({
    by: ["statusCode"],
    _count: {
      statusCode: true,
    },
    orderBy: {
      statusCode: "asc",
    },
  });

  return results.map((item) => ({
    statusCode: item.statusCode,
    count: item._count.statusCode,
  }));
};

export const getServiceAnalytics = async () => {
  const logs = await prisma.requestLog.findMany({
    select: {
      path: true,
      statusCode: true,
      responseTime: true,
    },
  });

  const registeredServices = Object.keys(serviceRegistry);
  const serviceMap = new Map();

  for (const serviceName of registeredServices) {
    serviceMap.set(serviceName, {
      service: serviceName,
      target: serviceRegistry[serviceName]?.target || null,
      totalRequests: 0,
      successCount: 0,
      errorCount: 0,
      responseTimes: [],
    });
  }

  for (const log of logs) {
    const match = log.path.match(/(?:\/api\/v1)?\/gateway\/([^/?]+)/);
    if (!match) continue;

    const service = match[1];

    if (!serviceMap.has(service)) {
      continue;
    }

    const entry = serviceMap.get(service);
    entry.totalRequests += 1;
    if (log.statusCode >= 200 && log.statusCode < 400) {
      entry.successCount += 1;
    } else if (log.statusCode >= 400) {
      entry.errorCount += 1;
    }
    entry.responseTimes.push(Number(log.responseTime || 0));
  }

  const results = [];

  for (const [service, data] of serviceMap.entries()) {
    data.responseTimes.sort((a, b) => a - b);
    const count = data.responseTimes.length;
    const sum = data.responseTimes.reduce((acc, val) => acc + val, 0);
    const avg = count > 0 ? sum / count : 0;

    const getPct = (pct) => {
      if (count === 0) return 0;
      const idx = Math.ceil((pct / 100) * count) - 1;
      return data.responseTimes[Math.max(0, Math.min(idx, count - 1))];
    };

    const hasRequests = data.totalRequests > 0;

    const successRate = hasRequests
      ? Number(((data.successCount / data.totalRequests) * 100).toFixed(1))
      : null;

    const errorRate = hasRequests
      ? Number(((data.errorCount / data.totalRequests) * 100).toFixed(2))
      : null;

    const averageResponseTime = hasRequests ? Number(avg.toFixed(0)) : null;
    const p95 = hasRequests ? getPct(95) : null;
    const p99 = hasRequests ? getPct(99) : null;

    results.push({
      service,
      target: data.target,
      count: data.totalRequests,
      totalRequests: data.totalRequests,
      requests: data.totalRequests,
      successCount: data.successCount,
      errorCount: data.errorCount,
      successRate,
      errorRate,
      averageResponseTime,
      p95,
      p99,
    });
  }

  results.sort((a, b) => b.totalRequests - a.totalRequests);
  return results;
};

export const getTopApiKeysAnalytics = async () => {
  const logs = await prisma.requestLog.findMany({
    where: {
      apiKeyId: {
        not: null,
      },
    },
    select: {
      apiKeyId: true,
      statusCode: true,
      responseTime: true,
    },
  });

  const keyMap = new Map();

  for (const log of logs) {
    if (!keyMap.has(log.apiKeyId)) {
      keyMap.set(log.apiKeyId, {
        apiKeyId: log.apiKeyId,
        requestCount: 0,
        successCount: 0,
        errorCount: 0,
        responseTimes: [],
      });
    }

    const entry = keyMap.get(log.apiKeyId);
    entry.requestCount += 1;
    if (log.statusCode >= 200 && log.statusCode < 400) {
      entry.successCount += 1;
    } else if (log.statusCode >= 400) {
      entry.errorCount += 1;
    }
    entry.responseTimes.push(Number(log.responseTime || 0));
  }

  const apiKeyIds = Array.from(keyMap.keys());

  const apiKeys = apiKeyIds.length
    ? await prisma.apiKey.findMany({
      where: {
        id: {
          in: apiKeyIds,
        },
      },
      select: {
        id: true,
        prefix: true,
      },
    })
    : [];

  const apiKeyMap = new Map(
    apiKeys.map((apiKey) => [apiKey.id, apiKey.prefix])
  );

  const results = [];

  for (const [id, data] of keyMap.entries()) {
    data.responseTimes.sort((a, b) => a - b);
    const count = data.responseTimes.length;
    const sum = data.responseTimes.reduce((acc, val) => acc + val, 0);
    const avg = count > 0 ? sum / count : 0;

    const getPct = (pct) => {
      if (count === 0) return 0;
      const idx = Math.ceil((pct / 100) * count) - 1;
      return data.responseTimes[Math.max(0, Math.min(idx, count - 1))];
    };

    const errorRate = data.requestCount > 0
      ? Number(((data.errorCount / data.requestCount) * 100).toFixed(2))
      : 0;

    results.push({
      apiKeyId: id,
      keyPrefix: apiKeyMap.get(id) ?? null,
      requestCount: data.requestCount,
      totalRequests: data.requestCount,
      successCount: data.successCount,
      errorCount: data.errorCount,
      errorRate,
      averageResponseTime: Number(avg.toFixed(0)),
      p95: getPct(95),
      p99: getPct(99),
    });
  }

  results.sort((a, b) => b.requestCount - a.requestCount);
  return results;
};

export const getEndpointAnalytics = async () => {
  const logs = await prisma.requestLog.findMany({
    select: {
      method: true,
      path: true,
      statusCode: true,
      responseTime: true,
    },
  });

  const endpointMap = new Map();

  for (const log of logs) {
    const key = `${log.method} ${log.path}`;
    if (!endpointMap.has(key)) {
      endpointMap.set(key, {
        method: log.method,
        path: log.path,
        totalRequests: 0,
        successCount: 0,
        errorCount: 0,
        responseTimes: [],
      });
    }

    const entry = endpointMap.get(key);
    entry.totalRequests += 1;
    if (log.statusCode >= 200 && log.statusCode < 400) {
      entry.successCount += 1;
    } else if (log.statusCode >= 400) {
      entry.errorCount += 1;
    }
    entry.responseTimes.push(Number(log.responseTime || 0));
  }

  const results = [];

  for (const [key, data] of endpointMap.entries()) {
    data.responseTimes.sort((a, b) => a - b);
    const count = data.responseTimes.length;
    const sum = data.responseTimes.reduce((acc, val) => acc + val, 0);
    const avg = count > 0 ? sum / count : 0;

    const getPct = (pct) => {
      if (count === 0) return 0;
      const idx = Math.ceil((pct / 100) * count) - 1;
      return data.responseTimes[Math.max(0, Math.min(idx, count - 1))];
    };

    const errorRate = data.totalRequests > 0
      ? Number(((data.errorCount / data.totalRequests) * 100).toFixed(2))
      : 0;

    results.push({
      endpoint: key,
      method: data.method,
      path: data.path,
      totalRequests: data.totalRequests,
      successCount: data.successCount,
      errorCount: data.errorCount,
      errorRate,
      averageResponseTime: Number(avg.toFixed(0)),
      p95ResponseTime: getPct(95),
      p99ResponseTime: getPct(99),
      p95: getPct(95),
      p99: getPct(99),
    });
  }

  results.sort((a, b) => b.totalRequests - a.totalRequests);
  return results;
};


export const getResponseTimeAnalytics = async () => {
  const [aggregateResult, logs] = await Promise.all([
    prisma.requestLog.aggregate({
      _count: {
        id: true,
      },
      _avg: {
        responseTime: true,
      },
      _min: {
        responseTime: true,
      },
      _max: {
        responseTime: true,
      },
    }),
    prisma.requestLog.findMany({
      select: {
        responseTime: true,
      },
      orderBy: {
        responseTime: "asc",
      },
    }),
  ]);

  const times = logs.map((l) => Number(l.responseTime || 0));

  const getPercentile = (pct) => {
    if (times.length === 0) return 0;
    const idx = Math.ceil((pct / 100) * times.length) - 1;
    return times[Math.max(0, Math.min(idx, times.length - 1))];
  };

  const p50 = getPercentile(50);
  const p95 = getPercentile(95);
  const p99 = getPercentile(99);

  return {
    totalRequests: aggregateResult._count.id,
    averageResponseTime: aggregateResult._avg.responseTime ?? 0,
    minimumResponseTime: aggregateResult._min.responseTime ?? 0,
    maximumResponseTime: aggregateResult._max.responseTime ?? 0,
    p50,
    p95,
    p99,
    p50ResponseTime: p50,
    p95ResponseTime: p95,
    p99ResponseTime: p99,
  };
};


export const getDailyRequestAnalytics = async () => {
  const logs = await prisma.requestLog.findMany({
    select: {
      createdAt: true,
      statusCode: true,
    },
    orderBy: {
      createdAt: "asc",
    },
  });

  const dailyCounts = {};

  for (const log of logs) {
    const date = log.createdAt.toISOString().split("T")[0];

    if (!dailyCounts[date]) {
      dailyCounts[date] = {
        date,
        total: 0,
        allowed: 0,
        rejected: 0,
      };
    }

    dailyCounts[date].total += 1;

    if (log.statusCode >= 200 && log.statusCode < 400) {
      dailyCounts[date].allowed += 1;
    } else if (log.statusCode >= 400) {
      dailyCounts[date].rejected += 1;
    }
  }

  return Object.values(dailyCounts);
};

export const getErrorRateAnalytics = async () => {
  const [
    totalRequests,
    successfulRequests,
    failedRequests,
  ] = await Promise.all([
    prisma.requestLog.count(),

    prisma.requestLog.count({
      where: {
        statusCode: {
          gte: 200,
          lt: 400,
        },
      },
    }),

    prisma.requestLog.count({
      where: {
        statusCode: {
          gte: 400,
        },
      },
    }),
  ]);

  const errorRate =
    totalRequests === 0
      ? 0
      : Number(((failedRequests / totalRequests) * 100).toFixed(2));

  return {
    totalRequests,
    successfulRequests,
    failedRequests,
    errorRate,
  };
};

export const getGatewayMonitoring = async () => {
  const startTime = Date.now();

  // PostgreSQL health check
  let databaseStatus = "connected";

  try {
    await prisma.$queryRaw`SELECT 1`;
  } catch (error) {
    databaseStatus = "disconnected";
  }

  // Redis health check
  let redisStatus = "connected";

  try {
    await redis.ping();
  } catch (error) {
    redisStatus = "disconnected";
  }

  // Request metrics
  const [totalRequests, recentErrors, responseTime] =
    await Promise.all([
      prisma.requestLog.count(),

      prisma.requestLog.count({
        where: {
          statusCode: {
            gte: 400,
          },
          createdAt: {
            gte: new Date(Date.now() - 24 * 60 * 60 * 1000),
          },
        },
      }),

      prisma.requestLog.aggregate({
        _avg: {
          responseTime: true,
        },
      }),
    ]);

  const uptime = process.uptime();
  const mem = process.memoryUsage();

  const gatewayStatus =
    databaseStatus === "disconnected"
      ? "unhealthy"
      : redisStatus === "disconnected"
        ? "degraded"
        : "healthy";

  return {
    status: gatewayStatus,
    uptime,
    checkTime: Date.now() - startTime,
    gateway: {
      status: gatewayStatus,
      uptime,
      checkTime: Date.now() - startTime,
    },

    database: {
      status: databaseStatus,
    },

    redis: {
      status: redisStatus,
    },

    memoryUsage: {
      rss: mem.rss,
      heapTotal: mem.heapTotal,
      heapUsed: mem.heapUsed,
      external: mem.external,
      arrayBuffers: mem.arrayBuffers ?? 0,
    },

    memory: {
      rss: Number((mem.rss / 1024 / 1024).toFixed(2)),
      heapUsed: Number((mem.heapUsed / 1024 / 1024).toFixed(2)),
      heapTotal: Number((mem.heapTotal / 1024 / 1024).toFixed(2)),
      external: Number((mem.external / 1024 / 1024).toFixed(2)),
    },

    metrics: {
      totalRequests,
      recentErrors,
      averageResponseTime: responseTime._avg.responseTime ?? 0,
    },
  };
};

export const getRateLimitAnalytics = async () => {
  const activeIdentifiers = await redis.sMembers("ratelimit:active");

  const results = [];

  for (const identifier of activeIdentifiers) {
    const redisKey = `ratelimit:${identifier}`;

    const [requests, ttl] = await Promise.all([
      redis.get(redisKey),
      redis.ttl(redisKey),
    ]);

    // Remove expired identifiers from the tracking set.
    if (requests === null || ttl <= 0) {
      await redis.sRem("ratelimit:active", identifier);
      continue;
    }

    const requestCount = Number(requests);

    const remaining = Math.max(
      0,
      MAX_REQUEST_LIMIT - requestCount
    );

    const utilization = Math.min(
      100,
      Math.round((requestCount / MAX_REQUEST_LIMIT) * 100)
    );

    results.push({
      identifier,
      requests: requestCount,
      remaining,
      utilization,
      limit: MAX_REQUEST_LIMIT,
      windowSeconds: WINDOW_SIZE_IN_SECONDS,
      ttl,
      status: requestCount > MAX_REQUEST_LIMIT
        ? "limited"
        : "active",
    });
  }

  return {
    limit: MAX_REQUEST_LIMIT,
    windowSeconds: WINDOW_SIZE_IN_SECONDS,
    activeKeys: results.length,
    engines: results,
  };
};


export const getRecentRequests = async () => {
  const logs = await prisma.requestLog.findMany({
    orderBy: {
      createdAt: "desc",
    },
    take: 10,
    select: {
      id: true,
      method: true,
      path: true,
      statusCode: true,
      responseTime: true,
      ipAddress: true,
      createdAt: true,
      apiKey: {
        select: {
          prefix: true,
        },
      },
    },
  });

  return logs.map((log) => ({
    id: log.id,
    method: log.method,
    path: log.path,
    statusCode: log.statusCode,
    responseTime: log.responseTime,
    ipAddress: log.ipAddress,
    apiKeyPrefix: log.apiKey?.prefix ?? null,
    createdAt: log.createdAt,
  }));
};
