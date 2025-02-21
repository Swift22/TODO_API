const { body, validationResult } = require("express-validator");

// Validation rules for user registration
exports.registerValidation = [
  body("name").notEmpty().withMessage("Name is required"),
  body("email").isEmail().withMessage("Please include a valid email"),
  body("password")
    .isLength({ min: 6 })
    .withMessage("Password must be at least 6 characters long"),
];

// Validation rules for to-do creation
exports.todoValidation = [
  body("title").notEmpty().withMessage("Title is required"),
];

// Middleware to check validation results
exports.validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  next();
};
