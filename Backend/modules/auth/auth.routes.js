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

/**
 * @swagger
 * /api/v1/auth/register:
 *   post:
 *     summary: Register a new user
 *     tags:
 *       - Authentication
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - email
 *               - password
 *             properties:
 *               name:
 *                 type: string
 *                 example: Aditya
 *               email:
 *                 type: string
 *                 format: email
 *                 example: aditya@example.com
 *               password:
 *                 type: string
 *                 format: password
 *                 example: Password@123
 *     responses:
 *       201:
 *         description: User registered successfully
 *       400:
 *         description: Invalid registration data
 *       409:
 *         description: User already exists
 */
router.post(
  "/register",
  validate(registerSchema),
  register
);

/**
 * @swagger
 * /api/v1/auth/login:
 *   post:
 *     summary: Login user
 *     tags:
 *       - Authentication
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 example: aditya@example.com
 *               password:
 *                 type: string
 *                 format: password
 *                 example: Password@123
 *     responses:
 *       200:
 *         description: Login successful
 *       401:
 *         description: Invalid credentials
 */
router.post(
  "/login",
  validate(loginSchema),
  login
);

/**
 * @swagger
 * /api/v1/auth/refresh:
 *   post:
 *     summary: Refresh access token
 *     tags:
 *       - Authentication
 *     responses:
 *       200:
 *         description: Access token refreshed successfully
 *       401:
 *         description: Invalid or expired refresh token
 */
router.post(
  "/refresh",
  refresh
);

/**
 * @swagger
 * /api/v1/auth/logout:
 *   post:
 *     summary: Logout user
 *     tags:
 *       - Authentication
 *     responses:
 *       200:
 *         description: User logged out successfully
 */
router.post(
  "/logout",
  logout
);

/**
 * @swagger
 * /api/v1/auth/profile:
 *   get:
 *     summary: Get current authenticated user profile
 *     tags:
 *       - Authentication
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Profile retrieved successfully
 *       401:
 *         description: Unauthorized
 */
router.get(
  "/profile",
  authenticate,
  getProfile
);

/**
 * @swagger
 * /api/v1/auth/admin:
 *   get:
 *     summary: Get admin dashboard data
 *     tags:
 *       - Authentication
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Admin data retrieved successfully
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden (Admin role required)
 */
router.get(
  "/admin",
  authenticate,
  authorize("admin"),
  adminDashboard
);

export default router;
