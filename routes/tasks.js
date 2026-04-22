const express = require('express');
const router = express.Router();
const Task = require('../models/Task');
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

// Get all tasks
router.get('/', async (req, res) => {
  try {
    const tasks = await Task.find();
    res.json(tasks);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Create task (admin only)
router.post('/create', auth, async (req, res) => {
  try {
    const { title, description, domain, difficulty, xpReward, deadline } = req.body;
    const task = new Task({
      title, description, domain,
      difficulty, xpReward, deadline,
      createdBy: req.user.id
    });
    await task.save();
    res.json({ message: 'Task created!', task });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;