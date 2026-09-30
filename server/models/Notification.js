const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema({
  recipient: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  sender: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  type: { 
    type: String, 
    enum: ['application_submitted', 'status_updated', 'interview_scheduled', 'application_withdrawn'],
    required: true 
  },
  title: { type: String, required: true },
  message: { type: String, required: true },
  relatedJob: { type: mongoose.Schema.Types.ObjectId, ref: 'Job' },
  relatedApplication: { type: mongoose.Schema.Types.ObjectId, ref: 'Application' },
  read: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Notification', notificationSchema);
