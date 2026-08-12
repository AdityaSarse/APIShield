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
} from "./analytics.controller.js";

const router = Router();

router.get(
  "/summary",
  authenticate,
  authorize("admin"),
  analyticsSummary
);

router.get(
  "/status-codes",
  authenticate,
  authorize("admin"),
  statusCodeAnalytics
);

router.get(
  "/services",
  authenticate,
  authorize("admin"),
  serviceAnalytics
);

router.get(
  "/top-api-keys",
  authenticate,
  authorize("admin"),
  topApiKeysAnalytics
);

router.get(
  "/response-times",
  authenticate,
  authorize("admin"),
  responseTimeAnalytics
);

router.get(
  "/daily",
  authenticate,
  authorize("admin"),
  dailyRequestAnalytics
);

router.get(
  "/error-rate",
  authenticate,
  authorize("admin"),
  errorRateAnalytics
);

export default router;
