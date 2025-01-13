const express = require('express');
const router = express.Router();
const { submitFeedback, getFeedbackStats } = require('../controllers/feedbackController');

// Correct the endpoint path: POST route to submit feedback
router.post('/', submitFeedback);  // Route matches the frontend `/feedback`

// GET route to fetch feedback stats for dashboard
router.get('/stats', getFeedbackStats); // Ensure this is the correct route
module.exports = router;
