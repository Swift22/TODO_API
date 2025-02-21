const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");
const User = require("./User");

const Todo = sequelize.define("Todo", {
  title: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  userId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: User,
      key: "id",
    },
  },
});

User.hasMany(Todo, { foreignKey: "userId" });
Todo.belongsTo(User, { foreignKey: "userId" });

module.exports = Todo;
