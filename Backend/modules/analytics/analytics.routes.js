import { Router } from "express";

import authenticate from "../../middleware/auth.middleware.js";
import authorize from "../../middleware/authorize.middleware.js";
import {
  analyticsSummary,
  statusCodeAnalytics,
  serviceAnalytics,
  topApiKeysAnalytics,
  responseTimeAnalytics,
  dailyRequestAnalytics,
  errorRateAnalytics,
  gatewayMonitoring,
} from "./analytics.controller.js";

const router = Router();

/**
 * @swagger
 * /api/v1/analytics/summary:
 *   get:
 *     summary: Get analytics summary
 *     tags:
 *       - Analytics
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Analytics summary fetched successfully
 *       401:
 *         description: Invalid or expired access token
 *       403:
 *         description: Forbidden
 */
router.get(
  "/summary",
  authenticate,
  authorize("admin"),
  analyticsSummary
);

/**
 * @swagger
 * /api/v1/analytics/status-codes:
 *   get:
 *     summary: Get status code analytics
 *     tags:
 *       - Analytics
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Status code analytics fetched successfully
 *       401:
 *         description: Invalid or expired access token
 *       403:
 *         description: Forbidden
 */
router.get(
  "/status-codes",
  authenticate,
  authorize("admin"),
  statusCodeAnalytics
);

/**
 * @swagger
 * /api/v1/analytics/services:
 *   get:
 *     summary: Get service usage analytics
 *     tags:
 *       - Analytics
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Service analytics fetched successfully
 *       401:
 *         description: Invalid or expired access token
 *       403:
 *         description: Forbidden
 */
router.get(
  "/services",
  authenticate,
  authorize("admin"),
  serviceAnalytics
);

/**
 * @swagger
 * /api/v1/analytics/top-api-keys:
 *   get:
 *     summary: Get top API keys usage analytics
 *     tags:
 *       - Analytics
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Top API keys analytics fetched successfully
 *       401:
 *         description: Invalid or expired access token
 *       403:
 *         description: Forbidden
 */
router.get(
  "/top-api-keys",
  authenticate,
  authorize("admin"),
  topApiKeysAnalytics
);

/**
 * @swagger
 * /api/v1/analytics/response-times:
 *   get:
 *     summary: Get response time analytics
 *     tags:
 *       - Analytics
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Response-time analytics fetched successfully
 *       401:
 *         description: Invalid or expired access token
 *       403:
 *         description: Forbidden
 */
router.get(
  "/response-times",
  authenticate,
  authorize("admin"),
  responseTimeAnalytics
);

/**
 * @swagger
 * /api/v1/analytics/daily:
 *   get:
 *     summary: Get daily request analytics
 *     tags:
 *       - Analytics
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Daily request analytics fetched successfully
 *       401:
 *         description: Invalid or expired access token
 *       403:
 *         description: Forbidden
 */
router.get(
  "/daily",
  authenticate,
  authorize("admin"),
  dailyRequestAnalytics
);

/**
 * @swagger
 * /api/v1/analytics/error-rate:
 *   get:
 *     summary: Get error-rate analytics
 *     tags:
 *       - Analytics
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Error-rate analytics fetched successfully
 *       401:
 *         description: Invalid or expired access token
 *       403:
 *         description: Forbidden
 */
router.get(
  "/error-rate",
  authenticate,
  authorize("admin"),
  errorRateAnalytics
);

/**
 * @swagger
 * /api/v1/analytics/monitoring:
 *   get:
 *     summary: Get gateway monitoring information
 *     tags:
 *       - Monitoring
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Gateway monitoring fetched successfully
 *       401:
 *         description: Invalid or expired access token
 *       403:
 *         description: Forbidden
 */
router.get(
  "/monitoring",
  authenticate,
  authorize("admin"),
  gatewayMonitoring
);

export default router;
