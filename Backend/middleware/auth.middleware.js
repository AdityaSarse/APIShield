import ApiError from "../utils/ApiError.js";
import { verifyAccessToken } from "../utils/jwt.js";

const authenticate = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
      throw new ApiError(401, "Authorization header is missing");
    }

    if (!authHeader.startsWith("Bearer ")) {
      throw new ApiError(401, "Invalid authorization format");
    }

    const token = authHeader.split(" ")[1];

    const decoded = verifyAccessToken(token);

    req.user = decoded;

    next();
  } catch (error) {
    if (
      error.name === "JsonWebTokenError" ||
      error.name === "TokenExpiredError"
    ) {
      return next(new ApiError(401, "Invalid or expired access token"));
    }

    next(error);
  }
};

export default authenticate;
