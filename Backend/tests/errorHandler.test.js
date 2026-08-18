import { jest } from "@jest/globals";
import { z } from "zod";
import errorHandler from "../middleware/errorHandler.js";
import ApiError from "../utils/ApiError.js";

describe("Error Handler Middleware", () => {
  const createResponse = () => {
    const res = {};

    res.status = jest.fn().mockReturnValue(res);
    res.json = jest.fn().mockReturnValue(res);

    return res;
  };

  const req = {};
  const next = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("should handle ApiError with its status code", () => {
    const error = new ApiError(404, "Resource not found");

    const res = createResponse();

    errorHandler(error, req, res, next);

    expect(res.status).toHaveBeenCalledWith(404);

    expect(res.json).toHaveBeenCalledWith({
      success: false,
      statusCode: 404,
      message: "Resource not found",
    });
  });

  test("should handle Zod validation errors", () => {
    const schema = z.object({
      name: z.string().min(3),
      email: z.string().email(),
    });

    let error;

    try {
      schema.parse({
        name: "Ad",
        email: "invalid-email",
      });
    } catch (err) {
      error = err;
    }

    const res = createResponse();

    errorHandler(error, req, res, next);

    expect(res.status).toHaveBeenCalledWith(400);

    expect(res.json).toHaveBeenCalledWith({
      success: false,
      statusCode: 400,
      message: "Validation failed",
      errors: error.issues.map((issue) => ({
        field: issue.path.join("."),
        message: issue.message,
      })),
    });
  });

  test("should return 500 for an unknown error", () => {
    const error = new Error("Something went wrong");

    const res = createResponse();

    errorHandler(error, req, res, next);

    expect(res.status).toHaveBeenCalledWith(500);

    expect(res.json).toHaveBeenCalledWith({
      success: false,
      statusCode: 500,
      message: "Something went wrong",
    });
  });

  test("should use default message for an error without a message", () => {
    const error = {
      statusCode: 500,
    };

    const res = createResponse();

    errorHandler(error, req, res, next);

    expect(res.status).toHaveBeenCalledWith(500);

    expect(res.json).toHaveBeenCalledWith({
      success: false,
      statusCode: 500,
      message: "Internal Server Error",
    });
  });
});
