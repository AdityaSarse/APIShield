import { Router } from "express";

import authenticate from "../../middleware/auth.middleware.js";
import authorize from "../../middleware/authorize.middleware.js";
import { analyticsSummary } from "./analytics.controller.js";

const router = Router();

router.get(
  "/summary",
  authenticate,
  authorize("admin"),
  analyticsSummary
);

export default router;
