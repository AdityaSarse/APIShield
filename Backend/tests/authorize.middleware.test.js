import { jest } from "@jest/globals";
import authorize from "../middleware/authorize.middleware.js";

describe("Authorization Middleware", () => {
  const createResponse = () => ({});

  test("should reject request when user is not authenticated", () => {
    const req = {
      user: undefined,
    };

    const next = jest.fn();

    authorize("developer", "admin")(
      req,
      createResponse(),
      next
    );

    expect(next).toHaveBeenCalledTimes(1);

    const error = next.mock.calls[0][0];

    expect(error.statusCode).toBe(401);
    expect(error.message).toBe("Unauthorized");
  });

  test("should reject user with unauthorized role", () => {
    const req = {
      user: {
        id: "user-123",
        email: "test@example.com",
        role: "user",
      },
    };

    const next = jest.fn();

    authorize("developer", "admin")(
      req,
      createResponse(),
      next
    );

    expect(next).toHaveBeenCalledTimes(1);

    const error = next.mock.calls[0][0];

    expect(error.statusCode).toBe(403);
    expect(error.message).toBe("Forbidden");
  });

  test("should allow user with an allowed role", () => {
    const req = {
      user: {
        id: "user-123",
        email: "developer@example.com",
        role: "developer",
      },
    };

    const next = jest.fn();

    authorize("developer", "admin")(
      req,
      createResponse(),
      next
    );

    expect(next).toHaveBeenCalledTimes(1);
    expect(next).toHaveBeenCalledWith();
  });

  test("should allow admin when admin role is allowed", () => {
    const req = {
      user: {
        id: "admin-123",
        email: "admin@example.com",
        role: "admin",
      },
    };

    const next = jest.fn();

    authorize("developer", "admin")(
      req,
      createResponse(),
      next
    );

    expect(next).toHaveBeenCalledTimes(1);
    expect(next).toHaveBeenCalledWith();
  });

  test("should reject developer when only admin is allowed", () => {
    const req = {
      user: {
        id: "user-123",
        email: "developer@example.com",
        role: "developer",
      },
    };

    const next = jest.fn();

    authorize("admin")(
      req,
      createResponse(),
      next
    );

    expect(next).toHaveBeenCalledTimes(1);

    const error = next.mock.calls[0][0];

    expect(error.statusCode).toBe(403);
    expect(error.message).toBe("Forbidden");
  });
});
