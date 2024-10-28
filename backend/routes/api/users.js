const express = require('express');
const bcrypt = require('bcryptjs');
const { check } = require('express-validator');
const { handleValidationErrors } = require('../../utils/validation');
const { setTokenCookie } = require('../../utils/auth');
const { User } = require('../../db/models');

const router = express.Router();

const validateSignup = [
  check('email')
    .exists({ checkFalsy: true })
    .isEmail()
    .withMessage('Please provide a valid email.'),
  check('username')
    .exists({ checkFalsy: true })
    .isLength({ min: 4 })
    .withMessage('Please provide a username with at least 4 characters.')
    .not()
    .isEmail()
    .withMessage('Username cannot be an email.'),
  check('password')
    .exists({ checkFalsy: true })
    .isLength({ min: 6 })
    .withMessage('Password must be 6 characters or more.'),
  check('firstName')
    .exists({ checkFalsy: true })
    .withMessage('Please provide a first name.'),
  check('lastName')
    .exists({ checkFalsy: true })
    .withMessage('Please provide a last name.'),
  handleValidationErrors
];

router.post(
  '/',
  validateSignup,
  async (req, res) => {
    const { email, password, username, firstName, lastName } = req.body;

    const existingUser = await User.findOne({
      where: { [User.sequelize.Op.or]: [{ email }, { username }] }
    });

    if (existingUser) {
      const errorKey = existingUser.email === email ? 'email' : 'username';
      return res.status(500).json({
        message: 'User already exists',
        errors: { [errorKey]: `User with that ${errorKey} already exists` }
      });
    }

    const hashedPassword = bcrypt.hashSync(password);
    const user = await User.create({
      email, username, firstName, lastName, hashedPassword
    });

    const safeUser = {
      id: user.id,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      username: user.username,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt
    };

    await setTokenCookie(res, safeUser);
    return res.status(201).json({ user: safeUser });
  }
);

module.exports = router;
