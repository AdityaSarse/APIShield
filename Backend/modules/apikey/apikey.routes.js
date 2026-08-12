import { Router } from "express";

import authenticate from "../../middleware/auth.middleware.js";
import authorize from "../../middleware/authorize.middleware.js";
import validate from "../../middleware/validate.js";

import {
  createApiKey,
  getApiKeys,
  getApiKey,
  revokeApiKey,
  rotateApiKey,
} from "./apikey.controller.js";

import { createApiKeySchema } from "./apikey.validation.js";

const router = Router();

/**
 * @swagger
 * /api/v1/apikeys:
 *   post:
 *     summary: Create a new API key
 *     tags:
 *       - API Keys
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *             properties:
 *               name:
 *                 type: string
 *                 example: Production API
 *               expiresAt:
 *                 type: string
 *                 format: date-time
 *                 example: 2027-01-01T00:00:00.000Z
 *     responses:
 *       201:
 *         description: API key created successfully
 *       400:
 *         description: Invalid request data
 *       401:
 *         description: Invalid or expired access token
 */
router.post(
  "/",
  authenticate,
  authorize("developer", "admin"),
  validate(createApiKeySchema),
  createApiKey
);

/**
 * @swagger
 * /api/v1/apikeys:
 *   get:
 *     summary: Get all API keys for authenticated user
 *     tags:
 *       - API Keys
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: API keys fetched successfully
 *       401:
 *         description: Invalid or expired access token
 */
router.get(
  "/",
  authenticate,
  authorize("developer", "admin"),
  getApiKeys
);

/**
 * @swagger
 * /api/v1/apikeys/{id}:
 *   get:
 *     summary: Get single API key details
 *     tags:
 *       - API Keys
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: API key ID
 *     responses:
 *       200:
 *         description: API key fetched successfully
 *       401:
 *         description: Invalid or expired access token
 *       404:
 *         description: API key not found
 */
router.get(
  "/:id",
  authenticate,
  authorize("developer", "admin"),
  getApiKey
);

/**
 * @swagger
 * /api/v1/apikeys/{id}/revoke:
 *   patch:
 *     summary: Revoke an API key
 *     tags:
 *       - API Keys
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: API key ID
 *     responses:
 *       200:
 *         description: API key revoked successfully
 *       400:
 *         description: API key is already revoked
 *       401:
 *         description: Invalid or expired access token
 *       404:
 *         description: API key not found
 */
router.patch(
  "/:id/revoke",
  authenticate,
  authorize("developer", "admin"),
  revokeApiKey
);

/**
 * @swagger
 * /api/v1/apikeys/{id}/rotate:
 *   patch:
 *     summary: Rotate an API key (generates a new secret key)
 *     tags:
 *       - API Keys
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: API key ID
 *     responses:
 *       200:
 *         description: API key rotated successfully
 *       400:
 *         description: Cannot rotate a revoked API key
 *       401:
 *         description: Invalid or expired access token
 *       404:
 *         description: API key not found
 */
router.patch(
  "/:id/rotate",
  authenticate,
  authorize("developer", "admin"),
  rotateApiKey
);

export default router;
