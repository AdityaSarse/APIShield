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
