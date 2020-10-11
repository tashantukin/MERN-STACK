const express = require('express');
const router = express.Router();

// @route GET api/posts/test
// @desc Test profiles route
// @access Public

router.get('/test', (req, res) => res.json({ msg: 'Profile Works' }));

module.exports = router;