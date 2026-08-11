import { Router } from "express";

import authenticate from "../../middleware/auth.middleware.js";
import authorize from "../../middleware/authorize.middleware.js";
import {
  analyticsSummary,
  statusCodeAnalytics,
  serviceAnalytics,
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

export default router;
