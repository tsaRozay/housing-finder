//backend/routes/api/csrf.js
const express = require('express');
const router = express.Router();

// Create a CSRF token route
router.get('/restore', (req, res) => {
  res.cookie('XSRF-TOKEN', req.csrfToken());
  return res.json({ csrfToken: req.csrfToken() });
});

module.exports = router;
