const mongoose = require('mongoose');

const gradeSchema = new mongoose.Schema({
  submission: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Submission',
    required: true
  },
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
  teacher: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  totalScore: {
    type: Number,
    required: true,
    min: 0,
    max: 100
  },
  percentage: {
    type: Number,
    min: 0,
    max: 100
  },
  letterGrade: {
    type: String,
    enum: ['A', 'A-', 'B+', 'B', 'B-', 'C+', 'C', 'C-', 'D+', 'D', 'F']
  },
  rubricScores: [{
    criteria: String,
    score: Number,
    maxScore: Number,
    comments: String
  }],
  isAutoGraded: {
    type: Boolean,
    default: false
  },
  gradingMethod: {
    type: String,
    enum: ['manual', 'automated', 'mixed'],
    default: 'manual'
  },
  gradedDate: {
    type: Date,
    default: Date.now
  },
  gradeChangedDate: Date,
  gradeChangeReason: String,
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
}, { timestamps: true });

// Helper method to calculate letter grade
gradeSchema.methods.calculateLetterGrade = function() {
  const percentage = this.percentage;
  if (percentage >= 90) this.letterGrade = 'A';
  else if (percentage >= 87) this.letterGrade = 'A-';
  else if (percentage >= 83) this.letterGrade = 'B+';
  else if (percentage >= 80) this.letterGrade = 'B';
  else if (percentage >= 77) this.letterGrade = 'B-';
  else if (percentage >= 73) this.letterGrade = 'C+';
  else if (percentage >= 70) this.letterGrade = 'C';
  else if (percentage >= 67) this.letterGrade = 'C-';
  else if (percentage >= 63) this.letterGrade = 'D+';
  else if (percentage >= 60) this.letterGrade = 'D';
  else this.letterGrade = 'F';
};

module.exports = mongoose.model('Grade', gradeSchema);
