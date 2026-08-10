import ApiResponse from "../../utils/ApiResponse.js";
import { generateKey } from "./services/generateKey.service.js";
import { listApiKeys } from "./services/listKeys.service.js";
import { getApiKeyDetails } from "./services/getKeyDetails.service.js";
import { revokeKey } from "./services/revokeKey.service.js";
import { rotateKey } from "./services/rotateKey.service.js";

export const createApiKey = async (req, res, next) => {
  try {
    const result = await generateKey({
      name: req.validatedData.name,
      expiresAt: req.validatedData.expiresAt,
      userId: req.user.id,
    });

    return res.status(201).json(
      new ApiResponse(201, "API key created successfully", result)
    );
  } catch (error) {
    next(error);
  }
};

export const getApiKeys = async (req, res, next) => {
  try {
    const keys = await listApiKeys(req.user.id);

    return res.status(200).json(
      new ApiResponse(
        200,
        "API keys fetched successfully",
        keys
      )
    );
  } catch (error) {
    next(error);
  }
};

export const getApiKey = async (req, res, next) => {
  try {
    const apiKey = await getApiKeyDetails(
      req.params.id,
      req.user.id
    );

    return res.status(200).json(
      new ApiResponse(
        200,
        "API key fetched successfully",
        apiKey
      )
    );
  } catch (error) {
    next(error);
  }
};

export const revokeApiKey = async (req, res, next) => {
  try {
    const result = await revokeKey(
      req.params.id,
      req.user.id
    );

    return res.status(200).json(
      new ApiResponse(
        200,
        "API key revoked successfully",
        result
      )
    );
  } catch (error) {
    next(error);
  }
};

export const rotateApiKey = async (req, res, next) => {
  try {
    const result = await rotateKey(
      req.params.id,
      req.user.id
    );

    return res.status(200).json(
      new ApiResponse(
        200,
        "API key rotated successfully",
        result
      )
    );
  } catch (error) {
    next(error);
  }
};
