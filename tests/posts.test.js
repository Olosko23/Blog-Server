import supertest from "supertest";
import app from "../index.js";
import mongoose from "mongoose";
import { MongoMemoryServer } from "mongodb-memory-server";
import User from "../models/userModel.js";

const request = supertest(app);
let mongoServer;

beforeAll(async () => {
  mongoServer = new MongoMemoryServer();
  const mongoUri = await mongoServer.getUri();
  await mongoose.connect(mongoUri);
});

afterAll(async () => {
  await mongoose.disconnect();
  await mongoServer.stop();
});

beforeEach(async () => {
  await User.deleteMany({});
});

describe("Post Controller Tests", () => {
  let authToken;
  let postId;

  beforeEach(async () => {
    const userResponse = await request.post("/api/auth/signup").send({
      username: "testuser",
      email: "test@example.com",
      password: "StrongPassword123!",
    });

    expect(userResponse.status).toBe(201);

    const loginResponse = await request.post("/api/auth/login").send({
      email: "test@example.com",
      password: "StrongPassword123!",
    });

    expect(loginResponse.status).toBe(200);
    authToken = loginResponse.body.token;
  });

  it("should create a new post", async () => {
    const response = await request
      .post("/api/posts")
      .set("Authorization", `Bearer ${authToken}`)
      .send({
        title: "Test Post",
        content: "This is a test post",
        coverImage: "path/to/coverImage.jpg",
        overview: "Test overview",
        tags: "test",
      });

    expect(response.status).toBe(201);
    expect(response.body).toHaveProperty("title", "Test Post");
    postId = response.body._id;
  });

  it("should edit an existing post", async () => {
    const response = await request
      .put(`/api/posts/${postId}`)
      .set("Authorization", `Bearer ${authToken}`)
      .send({
        title: "Updated Test Post",
        content: "This is an updated test post",
        tags: "updated-test",
      });

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty("title", "Updated Test Post");
  });

  it("should get all posts", async () => {
    const response = await request.get("/api/posts");

    expect(response.status).toBe(200);
  });

  it("should get a single post by ID", async () => {
    const response = await request.get(`/api/posts/${postId}`);

    expect(response.status).toBe(200);
  });

  it("should delete an existing post", async () => {
    const response = await request
      .delete(`/api/posts/${postId}`)
      .set("Authorization", `Bearer ${authToken}`);

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty(
      "message",
      "Post deleted successfully"
    );
  });
});
