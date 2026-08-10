import { Router } from "express";

import { authRoutes } from "../modules/auth/index.js";
import { apiKeyRoutes } from "../modules/apikey/index.js";
import { gatewayRoutes } from "../modules/gateway/index.js";
import { analyticsRoutes } from "../modules/analytics/index.js";

const router = Router();

router.use("/auth", authRoutes);
router.use("/apikeys", apiKeyRoutes);
router.use("/gateway", gatewayRoutes);
router.use("/analytics", analyticsRoutes);

export default router;
