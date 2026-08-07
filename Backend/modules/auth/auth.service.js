import bcrypt from "bcrypt";
import * as authRepository from "./auth.repository.js";
import ApiError from "../../utils/ApiError.js";

export const registerUser = async ({ name, email, password }) => {
  const existingUser = await authRepository.findUserByEmail(email);

  if (existingUser) {
    throw new ApiError(409, "Email already exists");
  }

  const passwordHash = await bcrypt.hash(password, 12);

  const user = await authRepository.createUser({
    name,
    email,
    passwordHash,
  });

  return {
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role,
    createdAt: user.createdAt,
  };
};
