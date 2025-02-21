const express = require("express");
const sequelize = require("./config/database");
const dotenv = require("dotenv");
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");
const cors = require("cors");
const authRoutes = require("./routes/auth");
const todoRoutes = require("./routes/todos");
const swaggerUi = require("swagger-ui-express");
const swaggerSpec = require("./swagger");

dotenv.config();
const app = express();

// Basic middleware
app.use(express.json()); // Parse JSON bodies
app.use(helmet()); // Basic security headers
app.use(cors()); // Enable CORS

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100,
});
app.use(limiter);

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/todos", todoRoutes);
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Error handling middleware
app.use((err, req, res, next) => {
  res.status(err.status || 500).json({ message: err.message });
});

// Set port
const PORT = process.env.PORT || 5000;

// Database connection and server startup
const startServer = async () => {
  try {
    await sequelize.authenticate();
    console.log("Database connection has been established successfully.");

    if (process.env.NODE_ENV === "development") {
      await sequelize.sync({ alter: true });
      console.log("Database synced");
    }

    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  } catch (error) {
    console.error("Unable to connect to the database:", error);
    process.exit(1);
  }
};

if (process.env.NODE_ENV !== "test") {
  startServer();
}

module.exports = app;
