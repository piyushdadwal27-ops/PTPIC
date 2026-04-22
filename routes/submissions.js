const express = require('express');
const router = express.Router();
const Submission = require('../models/Submission');
const User = require('../models/User');
const jwt = require('jsonwebtoken');

// Middleware to verify token
const auth = (req, res, next) => {
  const token = req.header('Authorization');
  if (!token) return res.status(401).json({ message: 'No token' });
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch {
    res.status(401).json({ message: 'Invalid token' });
  }
};

// Submit a task
router.post('/submit', auth, async (req, res) => {
  try {
    const { taskId, submissionLink } = req.body;
    const submission = new Submission({
      task: taskId,
      user: req.user.id,
      submissionLink
    });
    await submission.save();
    res.json({ message: 'Submission received!', submission });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Get all submissions (admin)
router.get('/all', auth, async (req, res) => {
  try {
    const submissions = await Submission.find()
      .populate('user', 'name email')
      .populate('task', 'title domain');
    res.json(submissions);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Approve submission and award XP
router.put('/approve/:id', auth, async (req, res) => {
  try {
    const { xpAwarded, feedback } = req.body;
    const submission = await Submission.findByIdAndUpdate(
      req.params.id,
      { status: 'approved', xpAwarded, feedback },
      { new: true }
    );
    await User.findByIdAndUpdate(
      submission.user,
      { $inc: { xp: xpAwarded } }
    );
    res.json({ message: 'Submission approved!', submission });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;