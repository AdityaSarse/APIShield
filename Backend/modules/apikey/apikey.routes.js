import { Router } from "express";

import authenticate from "../../middleware/auth.middleware.js";
import authorize from "../../middleware/authorize.middleware.js";
import validate from "../../middleware/validate.js";

import {
  createApiKey,
  getApiKeys,
} from "./apikey.controller.js";

import { createApiKeySchema } from "./apikey.validation.js";

const router = Router();

router.post(
  "/",
  authenticate,
  authorize("developer", "admin"),
  validate(createApiKeySchema),
  createApiKey
);

router.get(
  "/",
  authenticate,
  authorize("developer", "admin"),
  getApiKeys
);

export default router;
