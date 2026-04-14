const mongoose = require('mongoose');

const submissionSchema = new mongoose.Schema({
  assignment: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Assignment',
    required: true
  },
  student: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  submittedDate: {
    type: Date,
    default: Date.now
  },
  files: [{
    filename: String,
    originalName: String,
    filepath: String,
    mimeType: String,
    size: Number,
    uploadedAt: Date
  }],
  content: String,
  status: {
    type: String,
    enum: ['submitted', 'reviewed', 'graded', 'returned'],
    default: 'submitted'
  },
  isLate: Boolean,
  lateDays: Number,
  plagiariusScore: {
    type: Number,
    min: 0,
    max: 100
  },
  plagiarismReport: mongoose.Schema.Types.Mixed,
  gradedDate: Date,
  grade: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Grade'
  },
  feedback: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Feedback'
  },
  teacherNotes: String,
  studentNotes: String,
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
}, { timestamps: true });

// Index for efficient querying
submissionSchema.index({ assignment: 1, student: 1 }, { unique: true });

module.exports = mongoose.model('Submission', submissionSchema);
