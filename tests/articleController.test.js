import supertest from "supertest";
import app from "../index.js";
import Article from "../models/articleModel.js";

const request = supertest(app);

describe("Article Tests", () => {
  // Clean up the database before each test
  beforeEach(async () => {
    jest.setTimeout(20000);
    await Article.deleteMany({});
  });

  it("should create a new article", async () => {
    const response = await request.post("/api/articles").send({
      title: "Test Article",
      author: "Test Author",
      overview: "Test Overview",
      thumbnail: "Test Thumbnail",
      category: "Test Category",
      content: "Test Content",
    });

    expect(response.status).toBe(201);
    expect(response.body).toHaveProperty("title", "Test Article");
    expect(response.body).toHaveProperty("author", "Test Author");
  });

  it("should get all articles", async () => {
    // Create some test articles in the database
    await Article.create([
      { title: "Article 1", author: "Author 1", content: "Content 1" },
      { title: "Article 2", author: "Author 2", content: "Content 2" },
    ]);

    const response = await request.get("/api/articles").expect(200);

    expect(response.body.length).toBe(2);
  });

  it("should get a single article by ID", async () => {
    const createdArticle = await Article.create({
      title: "Test Article",
      author: "Test Author",
      content: "Test Content",
    });

    const response = await request
      .get(`/api/articles/${createdArticle._id}`)
      .expect(200);

    expect(response.body.title).toBe("Test Article");
  });

  it("should update an article by ID", async () => {
    const createdArticle = await Article.create({
      title: "Original Title",
      author: "Original Author",
      content: "Original Content",
    });

    const response = await request
      .put(`/api/articles/${createdArticle._id}`)
      .send({ title: "Updated Title" })
      .expect(200);

    expect(response.body.title).toBe("Updated Title");
  });

  it("should delete an article by ID", async () => {
    const createdArticle = await Article.create({
      title: "Test Article",
      author: "Test Author",
      content: "Test Content",
    });

    await request.delete(`/api/articles/${createdArticle._id}`).expect(200);

    const deletedArticle = await Article.findById(createdArticle._id);
    expect(deletedArticle).toBeNull();
  });
});
