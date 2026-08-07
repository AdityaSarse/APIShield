import * as authService from "./auth.service.js";
import ApiResponse from "../../utils/ApiResponse.js";

export const register = async (req, res, next) => {
  try {
    const user = await authService.registerUser(req.validatedData);

    return res.status(201).json(
      new ApiResponse(
        201,
        "User registered successfully",
        user
      )
    );
  } catch (error) {
    next(error);
  }
};
