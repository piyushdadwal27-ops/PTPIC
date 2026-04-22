const mongoose = require('mongoose');

const SubmissionSchema = new mongoose.Schema({
  task: { type: mongoose.Schema.Types.ObjectId, ref: 'Task', required: true },
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  submissionLink: { type: String, required: true },
  status: { type: String, default: 'pending' },
  feedback: { type: String, default: '' },
  xpAwarded: { type: Number, default: 0 },
  submittedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Submission', SubmissionSchema);