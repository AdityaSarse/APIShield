import ApiError from "../utils/ApiError.js";
import { hashApiKey } from "../utils/apiKey.js";
import * as repository from "../modules/apikey/apikey.repository.js";
import { createRequestLog } from "../modules/gateway/gateway.repository.js";

const logUnauthorized = async (req, startTime, apiKeyId = null) => {
  try {
    await createRequestLog({
      method: req.method,
      path: req.originalUrl || req.url,
      statusCode: 401,
      responseTime: Date.now() - startTime,
      ipAddress: req.ip || req.socket?.remoteAddress || null,
      userAgent: req.get?.("user-agent") || null,
      apiKeyId: apiKeyId,
    });
  } catch (logError) {
    console.error("Failed to log 401 unauthorized request:", logError);
  }
};

const authenticateApiKey = async (req, res, next) => {
  const startTime = Date.now();

  try {
    const apiKey = req.header("x-api-key");

    if (!apiKey) {
      await logUnauthorized(req, startTime, null);
      throw new ApiError(401, "API key is required");
    }

    const keyHash = hashApiKey(apiKey);

    const key = await repository.findApiKeyByHash(keyHash);

    if (!key) {
      await logUnauthorized(req, startTime, null);
      throw new ApiError(401, "Invalid API key");
    }

    if (key.revoked) {
      await logUnauthorized(req, startTime, key.id);
      throw new ApiError(401, "API key has been revoked");
    }

    if (key.expiresAt && key.expiresAt < new Date()) {
      await logUnauthorized(req, startTime, key.id);
      throw new ApiError(401, "API key has expired");
    }

    await repository.updateLastUsedAt(key.id);

    req.apiKey = key;
    req.user = key.user;

    next();
  } catch (error) {
    next(error);
  }
};

export default authenticateApiKey;
