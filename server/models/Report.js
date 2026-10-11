const mongoose = require('mongoose');

const reportSchema = new mongoose.Schema({
  reporter: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    required: true 
  },
  targetType: { 
    type: String, 
    enum: ['job', 'company', 'user'], 
    required: true 
  },
  targetId: { 
    type: mongoose.Schema.Types.ObjectId, 
    required: true 
  },
  targetTitle: { 
    type: String, 
    default: '' 
  },
  reason: { 
    type: String, 
    enum: [
      'scam_fraud', 
      'fake_company', 
      'misleading_salary', 
      'discrimination', 
      'harassment', 
      'spam', 
      'other'
    ], 
    required: true 
  },
  details: { 
    type: String, 
    default: '' 
  },
  status: { 
    type: String, 
    enum: ['pending', 'investigating', 'resolved', 'dismissed'], 
    default: 'pending' 
  },
  adminNotes: { 
    type: String, 
    default: '' 
  },
  actionTaken: { 
    type: String, 
    enum: ['none', 'user_suspended', 'job_removed', 'warning_issued', 'dismissed'], 
    default: 'none' 
  },
  createdAt: { 
    type: Date, 
    default: Date.now 
  },
  resolvedAt: { 
    type: Date 
  }
});

module.exports = mongoose.model('Report', reportSchema);
