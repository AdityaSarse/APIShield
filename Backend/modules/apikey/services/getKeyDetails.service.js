import * as apiKeyRepository from "../apikey.repository.js";
import ApiError from "../../../utils/ApiError.js";

export const getApiKeyDetails = async (id, userId) => {
  const apiKey = await apiKeyRepository.findApiKeyById(id, userId);

  if (!apiKey) {
    throw new ApiError(404, "API key not found");
  }

  return apiKey;
};
