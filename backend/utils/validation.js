// backend/utils/validation.js
const { validationResult } = require('express-validator');

// middleware for formatting errors from express-validator middleware
// (to customize, see express-validator's documentation)
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
    };
    err.status = 400;
    next(err);
  }
  next();
};

const validateQueryParams = (query) => {
  const errors = {};
  const { page, size, minLat, maxLat, minLng, maxLng, minPrice, maxPrice } = query;

  const pageNum = parseInt(page);
  const pageSize = parseInt(size);

  if (pageNum < 1) errors.page = "Page must be greater than or equal to 1";
  if (pageSize < 1 || pageSize > 20) errors.size = "Size must be between 1 and 20";
  if (minLat && isNaN(minLat)) errors.minLat = "Minimum latitude is invalid";
  if (maxLat && isNaN(maxLat)) errors.maxLat = "Maximum latitude is invalid";
  if (minLng && isNaN(minLng)) errors.minLng = "Minimum longitude is invalid";
  if (maxLng && isNaN(maxLng)) errors.maxLng = "Maximum longitude is invalid";
  if (minPrice && minPrice < 0) errors.minPrice = "Minimum price must be greater than or equal to 0";
  if (maxPrice && maxPrice < 0) errors.maxPrice = "Maximum price must be greater than or equal to 0";

  return errors;
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

module.exports = {
  handleValidationErrors,
  validateQueryParams,
  validateSpot,
  validateReview
};