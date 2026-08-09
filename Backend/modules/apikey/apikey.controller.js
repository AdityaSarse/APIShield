import ApiResponse from "../../utils/ApiResponse.js";
import { generateKey } from "./services/generateKey.service.js";
import { listApiKeys } from "./services/listKeys.service.js";

export const createApiKey = async (req, res, next) => {
  try {
    const result = await generateKey({
      name: req.validatedData.name,
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
