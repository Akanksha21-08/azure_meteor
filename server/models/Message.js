const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema({
  // The two participants — always stored in sorted order so one doc covers both directions
  participants: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }],

  // The job this conversation is about (optional context)
  relatedJob: { type: mongoose.Schema.Types.ObjectId, ref: 'Job' },

  // The application this conversation is about (optional context)
  relatedApplication: { type: mongoose.Schema.Types.ObjectId, ref: 'Application' },

  sender:  { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  text:    { type: String, required: true, maxlength: 2000 },
  readBy:  [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
}, { timestamps: true });

// Index for fast conversation thread lookup
messageSchema.index({ participants: 1, createdAt: -1 });

module.exports = mongoose.model('Message', messageSchema);
