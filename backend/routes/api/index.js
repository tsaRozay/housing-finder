// backend/routes/api/index.js
const express = require('express');
const router = express.Router();
const csrfRouter = require('./csrf');  // Import the csrf router

// Use the CSRF router
router.use('/csrf', csrfRouter);

// Test route to echo back the request body
router.post('/test', (req, res) => {
  res.json({ requestBody: req.body });
});

module.exports = router;
