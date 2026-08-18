import { Router } from "express";

import authenticateApiKey from "../../middleware/apiKey.middleware.js";
import rateLimiter from "../../middleware/rateLimiter.middleware.js";
import requestLogger from "../../middleware/requestLogger.middleware.js";
import { gatewayHealth, proxyRequest } from "./gateway.controller.js";

const router = Router();

/**
 * @swagger
 * /api/v1/gateway/health:
 *   get:
 *     summary: Check API Gateway health
 *     tags:
 *       - Gateway
 *     security:
 *       - apiKeyAuth: []
 *     responses:
 *       200:
 *         description: Gateway is running
 *         headers:
 *           X-RateLimit-Limit:
 *             description: Maximum number of requests allowed in the current window
 *             schema:
 *               type: integer
 *               example: 5
 *           X-RateLimit-Remaining:
 *             description: Number of requests remaining in the current window
 *             schema:
 *               type: integer
 *               example: 4
 *       401:
 *         description: API key is missing, invalid, revoked, or expired
 *       429:
 *         description: Rate limit exceeded
 *         headers:
 *           Retry-After:
 *             description: Number of seconds before another request should be attempted
 *             schema:
 *               type: integer
 *               example: 58
 */
router.get(
  "/health",
  authenticateApiKey,
  rateLimiter,
  requestLogger,
  gatewayHealth
);

/**
 * @swagger
 * /api/v1/gateway/{service}:
 *   get:
 *     summary: Proxy a request to a registered service
 *     tags:
 *       - Gateway
 *     security:
 *       - apiKeyAuth: []
 *     parameters:
 *       - in: path
 *         name: service
 *         required: true
 *         schema:
 *           type: string
 *         description: Registered service name
 *         example: users
 *     responses:
 *       200:
 *         description: Response returned by the target service
 *         headers:
 *           X-RateLimit-Limit:
 *             description: Maximum number of requests allowed in the current window
 *             schema:
 *               type: integer
 *               example: 5
 *           X-RateLimit-Remaining:
 *             description: Number of requests remaining in the current window
 *             schema:
 *               type: integer
 *               example: 4
 *       401:
 *         description: API key is missing, invalid, revoked, or expired
 *       404:
 *         description: Service not found
 *       429:
 *         description: Rate limit exceeded
 *         headers:
 *           Retry-After:
 *             description: Number of seconds before another request should be attempted
 *             schema:
 *               type: integer
 *               example: 58
 *       502:
 *         description: Target service is unreachable
 */
router.use(
  "/:service",
  authenticateApiKey,
  rateLimiter,
  requestLogger,
  proxyRequest
);

export default router;
