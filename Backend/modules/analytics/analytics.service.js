import prisma from "../../config/prisma.js";

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
    },
  });

  const serviceCounts = {};

  for (const log of logs) {
    const match = log.path.match(/\/api\/v1\/gateway\/([^/]+)/);

    if (!match) {
      continue;
    }

    const service = match[1];

    serviceCounts[service] = (serviceCounts[service] || 0) + 1;
  }

  return Object.entries(serviceCounts)
    .map(([service, count]) => ({
      service,
      count,
    }))
    .sort((a, b) => b.count - a.count);
};

export const getTopApiKeysAnalytics = async () => {
  const results = await prisma.requestLog.groupBy({
    by: ["apiKeyId"],
    where: {
      apiKeyId: {
        not: null,
      },
    },
    _count: {
      apiKeyId: true,
    },
    orderBy: {
      _count: {
        apiKeyId: "desc",
      },
    },
  });

  const apiKeyIds = results
    .map((item) => item.apiKeyId)
    .filter(Boolean);

  const apiKeys = await prisma.apiKey.findMany({
    where: {
      id: {
        in: apiKeyIds,
      },
    },
    select: {
      id: true,
      prefix: true,
    },
  });

  const apiKeyMap = new Map(
    apiKeys.map((apiKey) => [apiKey.id, apiKey.prefix])
  );

  return results.map((item) => ({
    apiKeyId: item.apiKeyId,
    keyPrefix: apiKeyMap.get(item.apiKeyId) ?? null,
    requestCount: item._count.apiKeyId,
  }));
};

export const getResponseTimeAnalytics = async () => {
  const result = await prisma.requestLog.aggregate({
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
  });

  return {
    totalRequests: result._count.id,
    averageResponseTime: result._avg.responseTime ?? 0,
    minimumResponseTime: result._min.responseTime ?? 0,
    maximumResponseTime: result._max.responseTime ?? 0,
  };
};
