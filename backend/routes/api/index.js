// backend/routes/api/index.js
const router = require('express').Router();
const sessionRouter = require('./session.js')
const usersRouter = require('./users.js')
const csrfRouter = require('./csrf');  // Import the csrf router
const { restoreUser } = require('../../utils/auth.js');

// Use the CSRF router
router.use('/csrf', csrfRouter);

// Test route to echo back the request body

// GET /api/set-token-cookie
const { setTokenCookie } = require('../../utils/auth.js');
const { User } = require('../../db/models');
router.get('/set-token-cookie', async (_req, res) => {
  const user = await User.findOne({
    where: {
      username: 'Demo-lition'
    }
  });
  setTokenCookie(res, user);
  return res.json({ user: user });
});

router.use(restoreUser);

router.use('/session', sessionRouter)

router.use('/users', usersRouter)

router.post('/test', (req, res) => {
  res.json({ requestBody: req.body });
});

router.get(
  '/restore-user',
  (req, res) => {
    return res.json(req.user);
  }
);

// GET /api/require-auth
const { requireAuth } = require('../../utils/auth.js');
router.get(
  '/require-auth',
  requireAuth,
  (req, res) => {
    return res.json(req.user);
  }
);


module.exports = router;
