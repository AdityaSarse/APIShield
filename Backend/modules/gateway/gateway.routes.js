import { Router } from "express";

import authenticateApiKey from "../../middleware/apiKey.middleware.js";
import rateLimiter from "../../middleware/rateLimiter.middleware.js";
import requestLogger from "../../middleware/requestLogger.middleware.js";
import { gatewayHealth, proxyRequest } from "./gateway.controller.js";

const router = Router();

router.get(
  "/health",
  authenticateApiKey,
  rateLimiter,
  requestLogger,
  gatewayHealth
);

router.use(
  "/:service",
  authenticateApiKey,
  rateLimiter,
  requestLogger,
  proxyRequest
);

export default router;
