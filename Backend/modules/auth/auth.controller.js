import { registerUser } from "./services/register.service.js";
import { loginUser } from "./services/login.service.js";
import ApiResponse from "../../utils/ApiResponse.js";

export const register = async (req, res, next) => {
  try {
    const user = await registerUser(req.validatedData);

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

export const login = async (req, res, next) => {
  try {
    const { user, accessToken, refreshToken } = await loginUser(req.validatedData);

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    return res.status(200).json(
      new ApiResponse(
        200,
        "Login successful",
        {
          user,
          accessToken,
        }
      )
    );
  } catch (error) {
    next(error);
  }
};
