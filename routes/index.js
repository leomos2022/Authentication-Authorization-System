const express = require('express');
const router = express.Router();
const { ensureAuthenticated } = require('../middleware/authenticate');

// Members-only home page
router.get('/', ensureAuthenticated, (req, res) => {
  res.render('index', { title: 'Home' });
});

module.exports = router;
