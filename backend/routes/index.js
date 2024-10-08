// backend/routes/index.js
const express = require('express');
const router = express.Router();
const apiRouter = require('./api');  // Import the main API router

// Use the API router for the main API routes
router.use('/api', apiRouter);

// Sample hello/world route
router.get('/hello/world', function(req, res) {
  res.cookie('XSRF-TOKEN', req.csrfToken());
  res.send('Hello World!');
});

module.exports = router;
