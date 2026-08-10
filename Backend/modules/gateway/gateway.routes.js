import { Router } from "express";
import authenticateApiKey from "../../middleware/apiKey.middleware.js";

const router = Router();

router.get("/test", authenticateApiKey, (req, res) => {
  res.json({
    success: true,
    message: "API key authenticated successfully",
    data: {
      apiKeyId: req.apiKey.id,
      userId: req.user.id,
      email: req.user.email,
    },
  });
});

export default router;
