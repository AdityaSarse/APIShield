import { Router } from "express";

import prisma from "../config/prisma.js";
import redis from "../config/redis.js";
import { authRoutes } from "../modules/auth/index.js";
import { apiKeyRoutes } from "../modules/apikey/index.js";
import { gatewayRoutes } from "../modules/gateway/index.js";
import { analyticsRoutes } from "../modules/analytics/index.js";

const router = Router();

/**
 * @swagger
 * /api/v1/health:
 *   get:
 *     summary: System Health & Readiness Check
 *     tags:
 *       - Health
 *     responses:
 *       200:
 *         description: System is healthy (Database and Redis connected)
 *       503:
 *         description: Service is degraded or unhealthy
 */
router.get("/health", async (req, res) => {
  let dbStatus = "connected";
  let redisStatus = "connected";

  try {
    await prisma.$queryRaw`SELECT 1`;
  } catch (err) {
    dbStatus = "disconnected";
  }

  try {
    await redis.ping();
  } catch (err) {
    redisStatus = "disconnected";
  }

  const isHealthy = dbStatus === "connected" && redisStatus === "connected";
  const statusCode = isHealthy ? 200 : 503;

  return res.status(statusCode).json({
    success: isHealthy,
    statusCode,
    message: isHealthy
      ? "APIShield is healthy"
      : "APIShield service is degraded or unhealthy",
    data: {
      status: isHealthy ? "healthy" : "unhealthy",
      timestamp: new Date().toISOString(),
      services: {
        database: dbStatus,
        redis: redisStatus,
      },
    },
  });
});

router.use("/auth", authRoutes);
router.use("/apikeys", apiKeyRoutes);
router.use("/gateway", gatewayRoutes);
router.use("/analytics", analyticsRoutes);

export default router;
