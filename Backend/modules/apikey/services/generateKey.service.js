import * as repository from "../apikey.repository.js";

import {
  generateApiKey,
  hashApiKey,
  getKeyPrefix,
} from "../../../utils/apiKey.js";

export const generateKey = async ({ name, userId }) => {
  const apiKey = generateApiKey();

  const keyHash = hashApiKey(apiKey);

  const prefix = getKeyPrefix(apiKey);

  const created = await repository.createApiKey({
    name,
    keyHash,
    prefix,
    userId,
  });

  return {
    id: created.id,
    name: created.name,
    apiKey,
    createdAt: created.createdAt,
  };
};
