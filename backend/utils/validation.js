const { validationResult } = require('express-validator');
const handleValidationErrors = (req, res, next) => {
  const validationErrors = validationResult(req);

  if (!validationErrors.isEmpty()) {
    const errors = {};
    validationErrors
      .array()
      .forEach(error => errors[error.path] = error.msg);

    const err = Error("Bad Request");
    err.errors = {
      "credential": "Email or username is required",
      "password": "Password is required",
      "username": "Username is required"
    }
    err.status = 400;
    next(err);
  }
  next();
};

const validateSpot = (req, res, next) => {
  const { address, city, state, country, lat, lng, name, description, price } = req.body;
  const errors = {};

  if (!address) errors.address = "Street address is required";
  if (!city) errors.city = "City is required";
  if (!state) errors.state = "State is required";
  if (!country) errors.country = "Country is required";
  if (!lat || lat < -90 || lat > 90) errors.lat = "Latitude must be within -90 and 90";
  if (!lng || lng < -180 || lng > 180) errors.lng = "Longitude must be within -180 and 180";
  if (!name || name.length > 50) errors.name = "Name must be less than 50 characters";
  if (!description) errors.description = "Description is required";
  if (!price || price <= 0) errors.price = "Price per day must be a positive number";

  if (Object.keys(errors).length > 0) {
    return res.status(400).json({
      "message": "Bad Request",
      "errors": errors
    })
  }
  next();
}

const validateReview = (req, res, next) => {
  const { review, stars } = req.body;
  const errors = {};
  if (!review) errors.review = "Review text is required";
  if (!stars || stars < 1 || stars > 5) errors.stars = "Stars must be an integer from 1 to 5";

  if (Object.keys(errors).length > 0) {
    return res.status(400).json({
      "message": "Bad Request",
      "errors": errors
    })
  }
  next();
}

const validateUserBody = (req, res, next) => {
  const { email, username, firstName, lastName } = req.body;
  const error = {};
  if (!email || !/\S+@\S+\.\S+/.test(email)) {
    error.email = 'Invalid email';
  }
  if (!username || username.trim() === '') {
    error.username = "Username is required";
  }
  if (!firstName || firstName.trim() === '') {
    error.firstName = "First Name is required";
  }
  if(!lastName || lastName.trim() === '') {
    error.lastName = "Last Name is required";
  }
  if (Object.keys(error).length > 0) {
    return res.status(400).json({
      message: 'Bad Request',
      error
    });
  }
  next();
}

module.exports = {
  handleValidationErrors,
  validateReview,
  validateSpot,
  validateUserBody

};