import jwt from "jsonwebtoken";
import { env } from "../config/env.js";

export const generateAccessToken = (payload) => {
  return jwt.sign(payload, env.JWT_SECRET || "default_jwt_secret", {
    expiresIn: "15m",
  });
};

export const generateRefreshToken = (payload) => {
  return jwt.sign(payload, env.JWT_SECRET || "default_jwt_secret", {
    expiresIn: "7d",
  });
};

export const verifyToken = (token) => {
  return jwt.verify(token, env.JWT_SECRET || "default_jwt_secret");
};
