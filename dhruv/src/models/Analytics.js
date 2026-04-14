const mongoose = require('mongoose');

const analyticsSchema = new mongoose.Schema({
  assignment: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Assignment'
  },
  course: String,
  teacher: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  totalSubmissions: Number,
  submissionRate: Number,
  lateSubmissions: Number,
  averageScore: Number,
  medianScore: Number,
  standardDeviation: Number,
  highestScore: Number,
  lowestScore: Number,
  scoreDistribution: {
    A: Number,
    B: Number,
    C: Number,
    D: Number,
    F: Number
  },
  averageSubmissionTime: Number,
  averageGradingTime: Number,
  classAverageGrade: String,
  strugglingSudents: [{
    studentId: mongoose.Schema.Types.ObjectId,
    name: String,
    scorePercentage: Number
  }],
  topPerformers: [{
    studentId: mongoose.Schema.Types.ObjectId,
    name: String,
    scorePercentage: Number
  }],
  commonMistakes: [String],
  averageFeedbackLength: Number,
  autoGradingAccuracy: Number,
  plagiariusStatistics: {
    averagePlagiarismScore: Number,
    submissionsWithHighPlagiarism: Number
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

module.exports = mongoose.model('Analytics', analyticsSchema);
