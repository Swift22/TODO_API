const request = require("supertest");
const app = require("../server");
const User = require("../models/User");
const sequelize = require("../config/database");
const jwt = require("jsonwebtoken");

describe("Auth Endpoints", () => {
  beforeAll(async () => {
    // Connect to test database and sync
    await sequelize.sync({ force: true });
  });

  afterAll(async () => {
    // Close database connection
    await sequelize.close();
  });

  beforeEach(async () => {
    // Clear users table before each test
    await User.destroy({ where: {} });
  });

  describe("POST /api/auth/register", () => {
    const validUser = {
      name: "Test User",
      email: "test@example.com",
      password: "password123",
    };

    it("should register a new user", async () => {
      const res = await request(app).post("/api/auth/register").send(validUser);

      expect(res.statusCode).toBe(201);
      expect(res.body).toHaveProperty("token");

      // Verify user was created in database
      const user = await User.findOne({ where: { email: validUser.email } });
      expect(user).toBeTruthy();
      expect(user.name).toBe(validUser.name);
    });

    it("should not register user with existing email", async () => {
      // Create user first
      await User.create({
        ...validUser,
        password: "hashedpassword",
      });

      // Try to register same email
      const res = await request(app).post("/api/auth/register").send(validUser);

      expect(res.statusCode).toBe(400);
      expect(res.body.message).toBe("Email already in use");
    });
  });

  describe("POST /api/auth/login", () => {
    const validUser = {
      name: "Test User",
      email: "test@example.com",
      password: "password123",
    };

    beforeEach(async () => {
      // Create a test user before each login test
      await request(app).post("/api/auth/register").send(validUser);
    });

    it("should login with valid credentials", async () => {
      const res = await request(app).post("/api/auth/login").send({
        email: validUser.email,
        password: validUser.password,
      });

      expect(res.statusCode).toBe(200);
      expect(res.body).toHaveProperty("token");

      // Verify token is valid
      const decoded = jwt.verify(res.body.token, process.env.JWT_SECRET);
      expect(decoded).toHaveProperty("id");
    });

    it("should not login with wrong password", async () => {
      const res = await request(app).post("/api/auth/login").send({
        email: validUser.email,
        password: "wrongpassword",
      });

      expect(res.statusCode).toBe(400);
      expect(res.body.message).toBe("Invalid email or password");
    });

    it("should not login with non-existent email", async () => {
      const res = await request(app).post("/api/auth/login").send({
        email: "nonexistent@example.com",
        password: validUser.password,
      });

      expect(res.statusCode).toBe(400);
      expect(res.body.message).toBe("Invalid email or password");
    });
  });
});
