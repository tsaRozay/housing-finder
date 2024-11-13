// Import required modules
const express = require('express');
const bcrypt = require('bcryptjs');
const { check } = require('express-validator');
const { handleValidationErrors } = require('../../utils/validation');

// Import utility functions and models
const { setTokenCookie, requireAuth } = require('../../utils/auth');
const { User } = require('../../db/models');

// Sequelize's `Op` is used for operators (like OR, AND, etc.) in queries
// Although `Op` isn't used here, it's commonly imported in case complex queries are needed
const { Op } = require('sequelize');

const router = express.Router();

// Validation middleware for signup inputs
const validateSignup = [
    check('email')
      .exists({ checkFalsy: true }) // Ensures email exists and isn't falsy
      .isEmail()                    // Checks if it's a valid email format
      .withMessage('Invalid email'),
    check('username')
      .exists({ checkFalsy: true })
      .isLength({ min: 4 })         // Enforces a minimum length of 4 characters
      .withMessage('Username is required'),
    check('username')
      .not()
      .isEmail()                    // Ensures username is not an email format
      .withMessage('Username cannot be an email.'),
    check('firstName')
      .exists({ checkFalsy: true }) // Ensures first name isn't empty
      .withMessage('First Name is required'),
    check('lastName')
      .exists({ checkFalsy: true }) // Ensures last name isn't empty
      .withMessage('Last Name is required'),
    handleValidationErrors          // Catches and returns validation errors
];

// Sign up route
router.post(
    '/',
    validateSignup,  // Validation middleware to ensure input requirements are met
    async (req, res) => {
      const { email, password, username, firstName, lastName } = req.body;

      // Check if email or username is already registered
      const emailUser = await User.findOne({
        where: { email } // Looks up a user by email
      });

      const usernameUser = await User.findOne({
        where: { username } // Looks up a user by username
      });

      // Prepare error messages if email or username is taken
      const errors = {};
      if (emailUser) {
        errors.email = "User with that email already exists";
      }
      if (usernameUser) {
        errors.username = 'User with that username already exists';
      }

      // If either email or username exists, respond with an error
      if (emailUser || usernameUser) {
        return res.status(500).json({
          message: 'User already exists',
          errors
        });
      }

      // Hash the password and create a new user in the database
      const hashedPassword = bcrypt.hashSync(password);
      const user = await User.create({ email, username, hashedPassword, firstName, lastName });
  
      // Return only safe user details without the password hash
      const safeUser = {
        id: user.id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        username: user.username,
      };
  
      // Set a token cookie for the newly registered user
      await setTokenCookie(res, safeUser);
  
      // Respond with the created user object
      return res.status(201).json({
        user: safeUser
      });
    }
);

module.exports = router;
