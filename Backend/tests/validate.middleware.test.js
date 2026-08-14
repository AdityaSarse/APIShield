import { jest } from "@jest/globals";
import { z } from "zod";
import validate from "../middleware/validate.js";

describe("Validation Middleware", () => {
  const schema = z.object({
    name: z.string().min(3),
    email: z.string().email(),
  });

  const createResponse = () => ({});

  test("should validate valid request data", () => {
    const req = {
      body: {
        name: "Aditya",
        email: "aditya@example.com",
      },
    };

    const next = jest.fn();

    validate(schema)(req, createResponse(), next);

    expect(next).toHaveBeenCalledTimes(1);
    expect(next).toHaveBeenCalledWith();

    expect(req.validatedData).toEqual({
      name: "Aditya",
      email: "aditya@example.com",
    });
  });

  test("should reject invalid request data", () => {
    const req = {
      body: {
        name: "Ad",
        email: "invalid-email",
      },
    };

    const next = jest.fn();

    validate(schema)(req, createResponse(), next);

    expect(next).toHaveBeenCalledTimes(1);

    const error = next.mock.calls[0][0];

    expect(error).toBeInstanceOf(z.ZodError);
    expect(req.validatedData).toBeUndefined();
  });

  test("should reject missing required fields", () => {
    const req = {
      body: {},
    };

    const next = jest.fn();

    validate(schema)(req, createResponse(), next);

    expect(next).toHaveBeenCalledTimes(1);

    const error = next.mock.calls[0][0];

    expect(error).toBeInstanceOf(z.ZodError);
  });

  test("should store the parsed data in req.validatedData", () => {
    const req = {
      body: {
        name: "Aditya Sarse",
        email: "aditya@example.com",
      },
    };

    const next = jest.fn();

    validate(schema)(req, createResponse(), next);

    expect(req.validatedData).toEqual(req.body);
  });
});
