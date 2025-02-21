const Todo = require("../models/Todo");

// Create a new to-do item
exports.createTodo = async (req, res) => {
  try {
    const { title, description } = req.body;
    const userId = req.user.id;

    const todo = await Todo.create({ title, description, userId });
    res.status(201).json(todo);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

// Get all to-do items for a user
exports.getTodos = async (req, res) => {
  try {
    const page = parseInt(req.query.page);
    const limit = parseInt(req.query.limit);
    const userId = req.user.id;

    // If page and limit are provided, use pagination
    if (page && limit) {
      const offset = (page - 1) * limit;
      const { count, rows: todos } = await Todo.findAndCountAll({
        where: { userId },
        limit,
        offset,
        order: [["createdAt", "DESC"]],
      });

      return res.status(200).json({
        data: todos,
        pagination: {
          totalItems: count,
          totalPages: Math.ceil(count / limit),
          currentPage: page,
          itemsPerPage: limit,
          hasNextPage: page < Math.ceil(count / limit),
          hasPreviousPage: page > 1,
        },
      });
    }

    // If no pagination parameters, return all todos
    const todos = await Todo.findAll({
      where: { userId },
      order: [["createdAt", "DESC"]],
    });
    res.status(200).json(todos);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

// Update a to-do item
exports.updateTodo = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description } = req.body;
    const userId = req.user.id;

    const todo = await Todo.findOne({ where: { id, userId } });
    if (!todo) {
      return res.status(404).json({ message: "To-do item not found" });
    }

    todo.title = title;
    todo.description = description;
    await todo.save();

    res.status(200).json(todo);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

// Delete a to-do item
exports.deleteTodo = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    const todo = await Todo.findOne({ where: { id, userId } });
    if (!todo) {
      return res.status(404).json({ message: "To-do item not found" });
    }

    await todo.destroy();
    res.status(200).json({ message: "Todo deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};
