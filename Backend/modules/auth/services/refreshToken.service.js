import * as authRepository from "../auth.repository.js";
import ApiError from "../../../utils/ApiError.js";
import {
  verifyRefreshToken,
  generateAccessToken,
} from "../../../utils/jwt.js";

export const refreshAccessToken = async (refreshToken) => {
  if (!refreshToken) {
    throw new ApiError(401, "Refresh token is required");
  }

  let decoded;

  try {
    decoded = verifyRefreshToken(refreshToken);
  } catch (error) {
    throw new ApiError(401, "Invalid or expired refresh token");
  }

  const user = await authRepository.findUserById(decoded.id);

  if (!user) {
    throw new ApiError(401, "User not found");
  }

  const accessToken = generateAccessToken({
    id: user.id,
    email: user.email,
    role: user.role,
  });

  return { accessToken };
};
