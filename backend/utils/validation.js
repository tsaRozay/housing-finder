//^ backend/utils/validation.js
const { Booking } = require('../db/models')
const { validationResult } = require('express-validator');
const { check } = require('express-validator');
const { Op } = require('sequelize');

//~ middleware for formatting errors from express-validator middleware
//~ (to customize, see express-validator's documentation)
const handleValidationErrors = (req, _res, next) => {
  const validationErrors = validationResult(req);

  if (!validationErrors.isEmpty()) {
    const errors = {};
    validationErrors
      .array()
      .forEach(error => errors[error.path] = error.msg);

    const err = Error("Bad request.");
    err.errors = errors;
    err.status = 400;
    err.title = "Bad request.";
    next(err);
  }
  next();
};

const validateSignup = [
  check('email')
    .exists({ checkFalsy: true })
    .isEmail()
    .withMessage('Invalid email.'),
  check('username')
    .exists({ checkFalsy: true })
    .isLength({ min: 4 })
    .withMessage('Username is required'),
  check('username')
    .not()
    .isEmail()
    .withMessage('Username cannot be an email.'),
    check('firstName')
    .exists({ checkFalsy: true })
    .notEmpty()
    .withMessage('First Name is required'),
  check('lastName')
    .exists({ checkFalsy: true })
    .notEmpty()
    .withMessage('Last Name is required'),
  check('password')
    .exists({ checkFalsy: true })
    .notEmpty()
    .withMessage('Password is required')
    .custom((value, { req }) => {
      const length = value.length;
      if (length < 6) {
        throw new Error('Password must be 6 charecters or more')
      };
      return true;
    }),
  handleValidationErrors
];

const validateLogin = [
  check('credential')
    .exists({ checkFalsy: true })
    .notEmpty()
    .withMessage('Email or username is required'),
  check('password')
    .exists({ checkFalsy: true })
    .withMessage('Password is required'),
  handleValidationErrors
];

const validateSpot = [
  check('address')
    .exists({ checkFalsy: true })
    .notEmpty()
    .withMessage('Street address is required'),
  check('city')
    .exists({ checkFalsy: true })
    .notEmpty()
    .withMessage('City is required'),
  check('state')
    .exists({ checkFalsy: true })
    .notEmpty()
    .withMessage('State is required'),
  check('country')
    .exists({ checkFalsy: true })
    .notEmpty()
    .withMessage('Country is required'),
  check('lat')
    .exists({ checkFalsy: true })
    .notEmpty()
    .isNumeric()
    .withMessage('Latitude must be numeric')
    .custom((value, { req }) => {
      const num = Number(value);
      if (num < -90 || num > 90) {
          throw new Error('Latitude must be within -90 and 90')
      };
      return true;
    }),
  check('lng')
    .exists({ checkFalsy: true })
    .notEmpty()
    .isNumeric()
    .withMessage('Latitude must be numeric')
    .custom((value, { req }) => {
      const num = Number(value);
      if (num < -180 || num > 180) {
          throw new Error('Latitude must be within -180 and 180')
      }
      return true;
    }),
  check('name')
    .exists({ checkFalsy: true })
    .notEmpty()
    .isLength({ max: 50 })
    .withMessage('Name must be less than 50 characters'),
  check('description')
    .exists({ checkFalsy: true })
    .notEmpty()
    .isLength({ min: 2, max: 250 })
    .withMessage('Description is required'),
  check('price')
    .exists({ checkFalsy: true })
    .notEmpty()
    .isNumeric()
    .withMessage('Price must be a number')
    .custom((value, { req }) => {
      const num = Number(value);
      if (num < 0) {
          throw new Error('Price per day must be a positive number')
      }
      return true;
    }),
  handleValidationErrors
];

const validateBooking = [
  check('startDate')
    .exists({ checkFalsy: true })
    .notEmpty()
    .isDate()
    .withMessage('Start date must be a valild date')
    .custom(( value, { req }) => {
      const startDate = new Date(value);
      const endDate = new Date(req.body.endDate);
      const now = new Date();
      if (startDate < now) throw new Error(`startDate cannot be in the past`);
      if (startDate >= endDate) throw new Error(`startDate must be before endDate`);
      return true;
    }),
  check('endDate')
    .exists({ checkFalsy: true })
    .notEmpty()
    .isDate()
    .withMessage('End date must be a valid date')
    .custom(( value, { req }) => {
      const endDate = new Date(value);
      const startDate = new Date(req.body.startDate);
      if (endDate <= startDate) throw new Error(`endDate cannot be on or before startDate`);
      return true;
    }),
  handleValidationErrors
];

const validateReview = [
  check('review')
    .exists({ checkFalsy: true })
    .notEmpty()
    .isLength({ min:2, max: 250 })
    .withMessage('Review text is required'),
  check('stars')
    .exists({ checkFalsy: true })
    .notEmpty()
    .isNumeric()
    .withMessage('Stars must be an number')
    .custom(( value, { req }) => {
      const num = Number(value);
      if (num < 1 || num > 5) {
        throw new Error('Stars must be an integer from 1 to 5')
      };
      return true;
    }),
  handleValidationErrors
];

//^ booking conflict validation
const checkBookingConflict = async (req, res, next) => {
  const  startDate = new Date(req.body.startDate);
  const  endDate = new Date(req.body.endDate);
  const spotId = req.params.spotId;
  try {
    //^ get all bookings for same spot
    const existingBookings = await Booking.findAll({
      where: {
        spotId: spotId,
        [Op.or]: [
          //^ check for overlaps
          { startDate: { [Op.between]: [startDate, endDate] } },
          { endDate: { [Op.between]: [startDate, endDate] } },
          { [Op.and]: [
            { startDate: { [Op.lte]: startDate } },
            { endDate: { [Op.gte]: endDate } },
            ],
          },,
        ],
      },
    });

    //^conflict check
    if (existingBookings.length > 0) {
      return res.status(400).json({
         message: 'Sorry, this spot is already booked for the specified dates',
         errors: {
          startDate: 'Start date conflicts with an existing booking',
          endDate: 'End date conflicts with an existing booking'
         }
      })
    }
    next();
  } catch (error) {
    console.error(error); res.status(500).json({ message: 'An error occurred while checking for booking conflicts.' });
  };
};

module.exports = {
  validateSignup,
  validateLogin,
  validateSpot,
  validateBooking,
  validateReview,
  checkBookingConflict,
  handleValidationErrors
};