import ApiError from "../utils/ApiError.js";
import { hashApiKey } from "../utils/apiKey.js";
import * as repository from "../modules/apikey/apikey.repository.js";

const authenticateApiKey = async (req, res, next) => {
  try {
    const apiKey = req.header("x-api-key");

    if (!apiKey) {
      throw new ApiError(401, "API key is required");
    }

    const keyHash = hashApiKey(apiKey);

    const key = await repository.findApiKeyByHash(keyHash);

    if (!key) {
      throw new ApiError(401, "Invalid API key");
    }

    if (key.revoked) {
      throw new ApiError(401, "API key has been revoked");
    }

    if (key.expiresAt && key.expiresAt < new Date()) {
      throw new ApiError(401, "API key has expired");
    }

    req.apiKey = key;
    req.user = key.user;

    next();
  } catch (error) {
    next(error);
  }
};

export default authenticateApiKey;
