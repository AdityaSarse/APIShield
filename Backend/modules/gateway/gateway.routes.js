import { Router } from "express";
import authenticateApiKey from "../../middleware/apiKey.middleware.js";
import { gatewayHealth } from "./gateway.controller.js";

const router = Router();

router.get(
  "/health",
  authenticateApiKey,
  gatewayHealth
);

export default router;
