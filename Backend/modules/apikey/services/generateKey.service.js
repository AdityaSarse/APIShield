import * as repository from "../apikey.repository.js";

import {
  generateApiKey,
  hashApiKey,
  getKeyPrefix,
} from "../../../utils/apiKey.js";

export const generateKey = async ({
  name,
  expiresAt,
  userId,
}) => {
  const apiKey = generateApiKey();

  const keyHash = hashApiKey(apiKey);

  const prefix = getKeyPrefix(apiKey);

  const created = await repository.createApiKey({
    name,
    keyHash,
    prefix,
    userId,
    expiresAt: expiresAt ? new Date(expiresAt) : null,
  });

  return {
    id: created.id,
    name: created.name,
    apiKey,
    expiresAt: created.expiresAt,
    createdAt: created.createdAt,
  };
};
