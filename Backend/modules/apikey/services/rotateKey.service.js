import * as repository from "../apikey.repository.js";
import ApiError from "../../../utils/ApiError.js";

import {
  generateApiKey,
  hashApiKey,
  getKeyPrefix,
} from "../../../utils/apiKey.js";

export const rotateKey = async (id, userId) => {
  const apiKey = await repository.findApiKeyByIdForUpdate(id, userId);

  if (!apiKey) {
    throw new ApiError(404, "API key not found");
  }

  if (apiKey.revoked) {
    throw new ApiError(400, "Cannot rotate a revoked API key");
  }

  const newApiKey = generateApiKey();

  const keyHash = hashApiKey(newApiKey);

  const prefix = getKeyPrefix(newApiKey);

  const updated = await repository.updateApiKey(id, {
    keyHash,
    prefix,
  });

  return {
    ...updated,
    apiKey: newApiKey,
  };
};
