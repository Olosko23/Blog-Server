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
      title: "Exploring the Cosmos: Mysteries of the Universe",
      author: "Space Enthusiast",
      overview:
        "Embark on a cosmic journey as we unravel the mysteries of the universe, from black holes and dark matter to the wonders of distant galaxies. Join us in exploring the vastness of space and the scientific discoveries that continue to captivate our imaginations.",
      thumbnail: {
        title: "Cosmos Image",
        imageUrl: "https://unsplash.com/photos/cosmos-image",
      },
      category: "Science",
      content:
        "<div><h1>Exploring the Cosmos: Mysteries of the Universe</h1><p>Prepare for a journey beyond the stars as we delve into the mysteries of the universe. In this cosmic exploration, we'll venture into the unknown, discussing phenomena that have perplexed scientists and astronomers for centuries.</p><img src='https://example.com/cosmos_image.jpg' alt='Cosmos Image'><h2>The Enigma of Black Holes</h2><p>Black holes, mysterious cosmic entities with gravitational forces so intense that nothing can escape them, continue to intrigue scientists. Recent discoveries, such as gravitational waves, have opened new avenues for studying these enigmatic celestial bodies.</p></div><div><h2>Unveiling Dark Matter</h2><p>Dark matter, an invisible and elusive substance that makes up a significant portion of the universe, remains one of the greatest puzzles in astrophysics. Researchers are employing cutting-edge technologies to detect and understand the properties of dark matter, unlocking the secrets of the cosmos.</p></div><div><h2>The Wonders of Distant Galaxies</h2><p>Peering into the depths of space, astronomers have observed galaxies that defy our understanding of cosmic structures. From irregular galaxies to superclusters, each discovery adds to the tapestry of the universe, revealing its vastness and complexity.</p></div><div><h2>Interstellar Travel and Possibilities</h2><p>The dream of interstellar travel, once relegated to science fiction, is now a topic of serious scientific inquiry. Concepts like warp drives and solar sails are being explored as humanity contemplates the potential for exploring distant star systems and exoplanets.</p></div><div><h2>The Search for Extraterrestrial Life</h2><p>Are we alone in the universe? The search for extraterrestrial life continues, fueled by discoveries of exoplanets in the habitable zone and advancements in astrobiology. Scientists are exploring the conditions necessary for life and expanding our understanding of where life might exist beyond Earth.</p></div><div><h2>Cosmic Mysteries and Quantum Realms</h2><p>As we venture into the quantum realms of the universe, new mysteries unfold. Quantum entanglement, the nature of spacetime, and the fundamental building blocks of reality challenge our understanding, prompting a reexamination of the very fabric of the cosmos.</p></div><div><h2>Read Time: 6 Minutes</h2></div><div><h2>Conclusion</h2><p>Our journey through the cosmos has only scratched the surface of the mysteries that await exploration. With each discovery, humanity takes a step closer to unraveling the secrets of the universe, expanding our knowledge and igniting the curiosity that propels us toward the stars.</p></div>",
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
