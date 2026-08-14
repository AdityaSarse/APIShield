import { jest } from "@jest/globals";

import authenticate from "../middleware/auth.middleware.js";
import {
  generateAccessToken,
} from "../utils/jwt.js";

describe("Authentication Middleware", () => {
  const createResponse = () => ({});

  test("should reject request when Authorization header is missing", () => {
    const req = {
      headers: {},
    };

    const next = jest.fn();

    authenticate(req, createResponse(), next);

    expect(next).toHaveBeenCalledTimes(1);

    const error = next.mock.calls[0][0];

    expect(error.statusCode).toBe(401);
    expect(error.message).toBe("Authorization header is missing");
  });

  test("should reject invalid authorization format", () => {
    const req = {
      headers: {
        authorization: "Basic abc123",
      },
    };

    const next = jest.fn();

    authenticate(req, createResponse(), next);

    expect(next).toHaveBeenCalledTimes(1);

    const error = next.mock.calls[0][0];

    expect(error.statusCode).toBe(401);
    expect(error.message).toBe("Invalid authorization format");
  });

  test("should reject an invalid token", () => {
    const req = {
      headers: {
        authorization: "Bearer invalid-token",
      },
    };

    const next = jest.fn();

    authenticate(req, createResponse(), next);

    expect(next).toHaveBeenCalledTimes(1);

    const error = next.mock.calls[0][0];

    expect(error.statusCode).toBe(401);
    expect(error.message).toBe("Invalid or expired access token");
  });

  test("should authenticate a valid access token", () => {
    const payload = {
      id: "user-123",
      email: "test@example.com",
      role: "developer",
    };

    const token = generateAccessToken(payload);

    const req = {
      headers: {
        authorization: `Bearer ${token}`,
      },
    };

    const next = jest.fn();

    authenticate(req, createResponse(), next);

    expect(next).toHaveBeenCalledTimes(1);
    expect(next).toHaveBeenCalledWith();

    expect(req.user).toBeDefined();
    expect(req.user.id).toBe(payload.id);
    expect(req.user.email).toBe(payload.email);
    expect(req.user.role).toBe(payload.role);
  });
});
