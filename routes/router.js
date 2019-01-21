const express = require('express');
const router = express.Router();

// GET /
router.get('/', (req, res, next) => {
    return res.send('We are functional!');
});

module.exports = router;