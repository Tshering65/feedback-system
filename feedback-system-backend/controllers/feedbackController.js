const Feedback = require('../models/Feedback');

// Submit Feedback
exports.submitFeedback = async (req, res) => {
  const { service_type, emoji_feedback, text_feedback, email } = req.body;

  try {
    const newFeedback = new Feedback({
      service: service_type,
      emoji: emoji_feedback,
      feedback: text_feedback,
      email
    });

    await newFeedback.save();
    res.status(200).json({ message: 'Feedback submitted successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Error submitting feedback', error: err });
  }
};

// Get Feedback Stats
exports.getFeedbackStats = async (req, res) => {
  const { service } = req.query;  // Get the service from query parameter

  try {
    const feedbackStats = await Feedback.aggregate([
      { $match: { service: service } },  // Filter feedback based on the service
      { $group: { _id: '$emoji', count: { $sum: 1 } } }  // Count feedback by emoji
    ]);
    res.status(200).json(feedbackStats);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching stats', error: err });
  }
};
