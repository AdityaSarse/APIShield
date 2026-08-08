import { Router } from "express";
import {
  register,
  login,
  refresh,
  logout,
} from "./auth.controller.js";
import { getProfile } from "./auth.profile.controller.js";
import { adminDashboard } from "./auth.admin.controller.js";

import authenticate from "../../middleware/auth.middleware.js";
import authorize from "../../middleware/authorize.middleware.js";
import validate from "../../middleware/validate.js";

import {
  registerSchema,
  loginSchema,
} from "./auth.validation.js";

const router = Router();

router.post(
  "/register",
  validate(registerSchema),
  register
);

router.post(
  "/login",
  validate(loginSchema),
  login
);

router.post(
  "/refresh",
  refresh
);

router.post(
  "/logout",
  logout
);

router.get(
  "/profile",
  authenticate,
  getProfile
);

router.get(
  "/admin",
  authenticate,
  authorize("admin"),
  adminDashboard
);

export default router;
