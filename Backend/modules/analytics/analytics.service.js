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
