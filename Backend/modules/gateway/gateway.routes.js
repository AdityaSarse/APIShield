import { Router } from "express";

import authenticateApiKey from "../../middleware/apiKey.middleware.js";
import requestLogger from "../../middleware/requestLogger.middleware.js";
import { gatewayHealth, proxyRequest } from "./gateway.controller.js";

const router = Router();

router.get(
  "/health",
  authenticateApiKey,
  requestLogger,
  gatewayHealth
);

router.use(
  "/:service",
  authenticateApiKey,
  requestLogger,
  proxyRequest
);

export default router;
