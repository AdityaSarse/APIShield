import { Router } from "express";
import { register } from "./auth.controller.js";
import validate from "../../middleware/validate.js";
import { registerSchema } from "./auth.validation.js";

const router = Router();

router.post(
  "/register",
  validate(registerSchema),
  register
);

export default router;
