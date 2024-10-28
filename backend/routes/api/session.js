const express = require('express');
const { Op } = require('sequelize');
const bcrypt = require('bcryptjs');
const { check } = require('express-validator');
const { handleValidationErrors } = require('../../utils/validation');
const { setTokenCookie, restoreUser } = require('../../utils/auth');
const { User } = require('../../db/models');
const router = express.Router();

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

const formattedUser = (user) => ({
  id: user.id,
  firstName: user.firstName,
  lastName: user.lastName,
  email: user.email,
  username: user.username,
  createdAt: user.createdAt,
  updatedAt: user.updatedAt
});

router.post('/', validateLogin, async (req, res, next) => {
  const { credential, password } = req.body;

  const user = await User.unscoped().findOne({
    where: {
      [Op.or]: { username: credential, email: credential }
    }
  });

  if (!user || !bcrypt.compareSync(password, user.hashedPassword.toString())) {
    const err = new Error('Invalid credentials');
    err.status = 401;
    err.errors = { credential: 'Invalid credentials' };
    return next(err);
  }

  const safeUser = formattedUser(user);
  await setTokenCookie(res, safeUser);

  return res.json({ user: safeUser });
});

router.delete('/', (_req, res) => {
  res.clearCookie('token');
  return res.json({ message: 'success' });
});

router.get('/', (req, res) => {
  const { user } = req;
  return res.json({ user: user ? formattedUser(user) : null });
});

module.exports = router;