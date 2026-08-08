import ApiResponse from "../../utils/ApiResponse.js";
import { generateKey } from "./services/generateKey.service.js";

export const createApiKey = async (req, res, next) => {
  try {
    const result = await generateKey({
      name: req.validatedData.name,
      userId: req.user.id,
    });

    return res.status(201).json(
      new ApiResponse(
        201,
        "API key created successfully",
        result
      )
    );
  } catch (error) {
    next(error);
  }
};
