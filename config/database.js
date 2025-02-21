const { Sequelize } = require("sequelize");
const dotenv = require("dotenv");

// Load environment variables based on NODE_ENV
if (process.env.NODE_ENV === "test") {
  dotenv.config({ path: ".env.test" });
} else {
  dotenv.config();
}

// Initialize Sequelize with DATABASE_URL
const sequelize = new Sequelize(process.env.DATABASE_URL, {
  dialect: "postgres",
  logging:
    process.env.NODE_ENV === "test"
      ? false
      : (msg) => console.log("Sequelize:", msg),
});

module.exports = sequelize;
