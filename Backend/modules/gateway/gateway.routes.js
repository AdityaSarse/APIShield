import { Router } from "express";
import authenticateApiKey from "../../middleware/apiKey.middleware.js";
import { gatewayHealth, proxyRequest } from "./gateway.controller.js";

const router = Router();

router.get(
  "/health",
  authenticateApiKey,
  gatewayHealth
);

router.use(
  "/:service",
  authenticateApiKey,
  proxyRequest
);

export default router;
