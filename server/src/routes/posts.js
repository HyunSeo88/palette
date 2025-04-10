const express = require('express');
const router = express.Router();
const { auth } = require('../middleware/auth');

// Temporary route for testing
router.get('/', (req, res) => {
  res.json({ success: true, message: 'Posts route is working' });
});

module.exports = router; 