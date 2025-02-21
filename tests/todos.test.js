const request = require("supertest");
const app = require("../server");
const Todo = require("../models/Todo");
const User = require("../models/User");
const sequelize = require("../config/database");

describe("Todo Endpoints", () => {
  let authToken;
  let user;

  beforeAll(async () => {
    // Connect to test database and sync
    await sequelize.sync({ force: true });
  });

  afterAll(async () => {
    // Close database connection
    await sequelize.close();
  });

  beforeEach(async () => {
    // Clear todos and users tables before each test
    await Todo.destroy({ where: {} });
    await User.destroy({ where: {} });

    // Create a test user and get auth token
    const response = await request(app).post("/api/auth/register").send({
      name: "Test User",
      email: "test@example.com",
      password: "password123",
    });

    authToken = response.body.token;
    user = await User.findOne({ where: { email: "test@example.com" } });
  });

  describe("POST /api/todos", () => {
    it("should create a new todo", async () => {
      const res = await request(app)
        .post("/api/todos")
        .set("Authorization", authToken)
        .send({
          title: "Test Todo",
          description: "Test Description",
        });

      expect(res.statusCode).toBe(201);
      expect(res.body).toHaveProperty("id");
      expect(res.body.title).toBe("Test Todo");
      expect(res.body.description).toBe("Test Description");
    });

    it("should not create todo without auth token", async () => {
      const res = await request(app).post("/api/todos").send({
        title: "Test Todo",
        description: "Test Description",
      });

      expect(res.statusCode).toBe(401);
    });
  });

  describe("GET /api/todos", () => {
    beforeEach(async () => {
      // Create some test todos
      await Todo.create({
        title: "Todo 1",
        description: "Description 1",
        userId: user.id,
      });
      await Todo.create({
        title: "Todo 2",
        description: "Description 2",
        userId: user.id,
      });
    });

    it("should get all todos for user", async () => {
      const res = await request(app)
        .get("/api/todos")
        .set("Authorization", authToken);

      expect(res.statusCode).toBe(200);
      expect(Array.isArray(res.body)).toBeTruthy();
      expect(res.body.length).toBe(2);
    });
  });

  describe("GET /api/todos with pagination", () => {
    beforeEach(async () => {
      // Create 15 test todos
      for (let i = 0; i < 15; i++) {
        await Todo.create({
          title: `Todo ${i + 1}`,
          description: `Description ${i + 1}`,
          userId: user.id,
        });
      }
    });

    it("should get paginated todos", async () => {
      const res = await request(app)
        .get("/api/todos?page=1&limit=10")
        .set("Authorization", authToken);

      expect(res.statusCode).toBe(200);
      expect(res.body.data.length).toBe(10);
      expect(res.body.pagination).toHaveProperty("totalPages");
      expect(res.body.pagination.currentPage).toBe(1);
      expect(res.body.pagination.hasNextPage).toBe(true);
    });

    it("should get second page of todos", async () => {
      const res = await request(app)
        .get("/api/todos?page=2&limit=10")
        .set("Authorization", authToken);

      expect(res.statusCode).toBe(200);
      expect(res.body.data.length).toBe(5);
      expect(res.body.pagination.currentPage).toBe(2);
      expect(res.body.pagination.hasNextPage).toBe(false);
    });
  });

  describe("PUT /api/todos/:id", () => {
    let todo;

    beforeEach(async () => {
      todo = await Todo.create({
        title: "Original Todo",
        description: "Original Description",
        userId: user.id,
      });
    });

    it("should update a todo", async () => {
      const res = await request(app)
        .put(`/api/todos/${todo.id}`)
        .set("Authorization", authToken)
        .send({
          title: "Updated Todo",
          description: "Updated Description",
        });

      expect(res.statusCode).toBe(200);
      expect(res.body.title).toBe("Updated Todo");
      expect(res.body.description).toBe("Updated Description");
    });
  });

  describe("DELETE /api/todos/:id", () => {
    let todo;

    beforeEach(async () => {
      todo = await Todo.create({
        title: "Todo to delete",
        description: "Description",
        userId: user.id,
      });
    });

    it("should delete a todo", async () => {
      const res = await request(app)
        .delete(`/api/todos/${todo.id}`)
        .set("Authorization", authToken);

      expect(res.statusCode).toBe(200);

      // Verify todo was deleted
      const deletedTodo = await Todo.findByPk(todo.id);
      expect(deletedTodo).toBeNull();
    });
  });
});
