const mongoose = require('mongoose');

const assignmentSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Assignment title is required']
  },
  description: {
    type: String,
    required: [true, 'Assignment description is required']
  },
  courseCode: {
    type: String,
    required: [true, 'Course code is required']
  },
  courseName: String,
  teacher: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  dueDate: {
    type: Date,
    required: [true, 'Due date is required']
  },
  allowedFileType: {
    type: [String],
    default: ['pdf', 'doc', 'docx', 'txt', 'zip']
  },
  maxScore: {
    type: Number,
    default: 100,
    min: 0
  },
  rubric: {
    criteria: [{
      name: String,
      maxPoints: Number,
      description: String
    }]
  },
  instructions: String,
  attachments: [{
    filename: String,
    url: String,
    uploadedAt: Date
  }],
  isAutoGraded: {
    type: Boolean,
    default: false
  },
  autoGradingRules: mongoose.Schema.Types.Mixed,
  totalSubmissions: {
    type: Number,
    default: 0
  },
  gradeDistribution: {
    type: Map,
    of: Number
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
}, { timestamps: true });

module.exports = mongoose.model('Assignment', assignmentSchema);
