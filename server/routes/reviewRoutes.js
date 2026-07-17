const express = require('express');
const { createReview } = require('../controllers/reviewController');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

router.post('/:id/reviews', protect, createReview);

module.exports = router;