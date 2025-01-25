//^ backend/routes/api/users.js
const express = require('express');
const bcrypt = require('bcryptjs');
const { setTokenCookie } = require('../../utils/auth');
const { User } = require('../../db/models');
const { validateSignup } = require('../../utils/validation');

const router = express.Router();

//~ Sign up
router.post(
  '/',
  validateSignup,
  async (req, res) => {
    const { firstName, lastName, email, password, username } = req.body;
    const hashedPassword = bcrypt.hashSync(password);

    //^ error handeling for dupes
    const dupeEmailCheck = await User.findOne({ where: { email: email }});
    const dupeUsernameCheck = await User.findOne({ where: { username: username }});
    const errors = {};
    if (dupeEmailCheck) errors.email = 'User with that email already exists';
    if (dupeUsernameCheck) errors.username = 'User with that usnername already exists'
    if (Object.keys(errors). length > 0) return res.status(500).json({ message: 'User already exists', errors })

    const user = await User.create({ firstName, lastName, email, username, hashedPassword });

    const safeUser = {
      id: user.id,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      username: user.username,
    };

    await setTokenCookie(res, safeUser);

    return res.json({
      user: safeUser
    });
  }
);

module.exports = router;