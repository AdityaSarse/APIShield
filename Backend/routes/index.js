import { Router } from "express";
import { authRoutes } from "../modules/auth/index.js";
import apiKeyRoutes from "../modules/apikey/index.js";
import authenticateApiKey from "../middleware/apiKey.middleware.js";

const router = Router();

router.use("/auth", authRoutes);
router.use("/apikeys", apiKeyRoutes);

router.get(
  "/test",
  authenticateApiKey,
  (req, res) => {
    res.json({
      success: true,
      message: "API key authenticated",
      data: {
        id: req.apiKey.id,
        name: req.apiKey.name,
      },
    });
  }
);

export default router;
