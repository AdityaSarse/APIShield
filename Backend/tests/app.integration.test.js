import request from "supertest";
import app from "../app.js";

describe("APIShield Application Integration", () => {
  test("GET / should return backend health information", async () => {
    const response = await request(app)
      .get("/");

    expect(response.status).toBe(200);

    expect(response.body).toEqual({
      success: true,
      message: expect.any(String),
      version: "v1",
      status: "healthy",
    });
  });

  test("GET /unknown should return 404", async () => {
    const response = await request(app)
      .get("/unknown");

    expect(response.status).toBe(404);

    expect(response.body.success).toBe(false);
    expect(response.body.statusCode).toBe(404);
  });
});
