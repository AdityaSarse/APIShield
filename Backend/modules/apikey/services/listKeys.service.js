import * as apiKeyRepository from "../apikey.repository.js";

export const listApiKeys = async (userId) => {
  return await apiKeyRepository.findApiKeysByUserId(userId);
};
