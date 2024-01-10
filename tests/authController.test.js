import supertest from "supertest";
import app from "../index.js";
import User from "../models/userModel.js";

const request = supertest(app);

describe("Authentication Tests", () => {
  // Clean up the database before each test
  beforeEach(async () => {
    jest.setTimeout(20000); 
    await User.deleteMany({});
  });

  it("should signup a new user", async () => {
    const response = await request.post("/api/auth/signup").send({
      username: "testuser",
      email: "test@example.com",
      password: "StrongPassword123!",
    });

    expect(response.status).toBe(201);
    expect(response.body).toHaveProperty("username", "testuser");
    expect(response.body).toHaveProperty("email", "test@example.com");
  });

  it("should login an existing user", async () => {
    const signupResponse = await request.post("/api/auth/signup").send({
      username: "testuser",
      email: "test@example.com",
      password: "StrongPassword123!",
    });

    expect(signupResponse.status).toBe(201);

    // Login the user
    const loginResponse = await request.post("/api/auth/login").send({
      email: "test@example.com",
      password: "StrongPassword123!",
    });

    expect(loginResponse.status).toBe(200);
    expect(loginResponse.body).toHaveProperty("username", "testuser");
    expect(loginResponse.body).toHaveProperty("email", "test@example.com");
  });

  it("should handle incorrect login credentials", async () => {
    const response = await request.post("/api/auth/login").send({
      email: "nonexistent@example.com",
      password: "InvalidPassword123!",
    });

    expect(response.status).toBe(401);
    expect(response.body).toHaveProperty("error", "No user with that email");
  });

  it("should handle duplicate email during signup", async () => {
    // Signup a user with a specific email
    const signupResponse1 = await request.post("/api/auth/signup").send({
      username: "user1",
      email: "duplicate@example.com",
      password: "StrongPassword123!",
    });

    expect(signupResponse1.status).toBe(201);

    // Try to signup another user with the same email
    const signupResponse2 = await request.post("/api/auth/signup").send({
      username: "user2",
      email: "duplicate@example.com",
      password: "AnotherStrongPassword123!",
    });

    expect(signupResponse2.status).toBe(400);
    expect(signupResponse2.body).toHaveProperty(
      "error",
      "Email is already registered"
    );
  });

  it("should handle weak password during signup", async () => {
    const response = await request.post("/api/auth/signup").send({
      username: "testuser",
      email: "test@example.com",
      password: "weak",
    });

    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty(
      "error",
      "Password must be at least 8 characters long and contain at least one uppercase letter, one lowercase letter, one number, and one special character (@$!%*?&)"
    );
  });
});
