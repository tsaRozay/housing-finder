const { check, validationResult } = require('express-validator');

// Middleware for formatting errors from express-validator middleware
const handleValidationErrors = (req, _res, next) => {
  const validationErrors = validationResult(req);

  if (!validationErrors.isEmpty()) { 
    const errors = {};
    validationErrors
      .array()
      .forEach(error => errors[error.path] = error.msg);

    const err = new Error("Bad Request");
    err.errors = errors;
    err.status = 400;
    err.title = "Bad Request";
    next(err);
  }
  next();
};

// Define reviewValidation middleware
const reviewValidation = [
  check("review")
    .notEmpty()
    .withMessage("Review cannot be empty.")
    .isLength({ max: 255 })
    .withMessage("Review cannot be longer than 255 characters."),
  check("stars")
    .isInt({ min: 1, max: 5 })
    .withMessage("Stars must be an integer between 1 and 5."),
];

module.exports = {
  handleValidationErrors,
  reviewValidation,  // Export the reviewValidation array here
};
