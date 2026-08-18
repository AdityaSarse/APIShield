import * as repository from "../apikey.repository.js";
import ApiError from "../../../utils/ApiError.js";

export const revokeKey = async (id, userId) => {
  const apiKey = await repository.findApiKeyByIdForUpdate(id, userId);

  if (!apiKey) {
    throw new ApiError(404, "API key not found");
  }

  if (apiKey.revoked) {
    throw new ApiError(400, "API key is already revoked");
  }

  return repository.revokeApiKey(id);
};
