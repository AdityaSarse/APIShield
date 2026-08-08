import { Router } from "express";
import { authRoutes } from "../modules/auth/index.js";
import apiKeyRoutes from "../modules/apikey/index.js";

const router = Router();

router.use("/auth", authRoutes);
router.use("/apikeys", apiKeyRoutes);

export default router;
