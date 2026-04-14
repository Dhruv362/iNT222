const Grade = require('../models/Grade');
const Submission = require('../models/Submission');
const Assignment = require('../models/Assignment');

class GradingService {
  /**
   * Automated grading for multiple choice, true/false, short answer
   */
  static async autoGradeSubmission(submission, assignment) {
    try {
      if (!assignment.isAutoGraded || !assignment.autoGradingRules) {
        return null;
      }

      let totalScore = 0;
      let maxScore = 0;
      const rubricScores = [];

      // Process rubric criteria
      if (assignment.rubric && assignment.rubric.criteria) {
        for (const criterion of assignment.rubric.criteria) {
          const score = await this._evaluateCriterion(submission, criterion);
          rubricScores.push({
            criteria: criterion.name,
            score: score,
            maxScore: criterion.maxPoints,
            comments: `Auto-graded: ${score}/${criterion.maxPoints}`
          });
          totalScore += score;
          maxScore += criterion.maxPoints;
        }
      }

      // Normalize score to 100
      const percentage = maxScore > 0 ? (totalScore / maxScore) * 100 : 0;
      const finalScore = Math.min(percentage, 100);

      // Create grade object
      const grade = new Grade({
        submission: submission._id,
        assignment: assignment._id,
        student: submission.student,
        teacher: assignment.teacher,
        totalScore: finalScore,
        percentage: finalScore,
        rubricScores,
        isAutoGraded: true,
        gradingMethod: 'automated'
      });

      // Calculate letter grade
      grade.calculateLetterGrade();

      return grade;
    } catch (error) {
      console.error('Auto-grading error:', error);
      return null;
    }
  }

  /**
   * Evaluate individual rubric criteria
   */
  static async _evaluateCriterion(submission, criterion) {
    // This is a placeholder implementation
    // In production, you would integrate with actual assessment logic
    // For example: keyword checking, regex matching, API calls, etc.

    if (!submission.content) return 0;

    // Example: Award points based on content length
    const minWords = 50;
    const maxWords = 5000;
    const wordCount = submission.content.split(/\s+/).length;

    if (wordCount >= minWords && wordCount <= maxWords) {
      return Math.min(criterion.maxPoints, Math.floor((wordCount / maxWords) * criterion.maxPoints));
    }

    return Math.max(0, Math.floor((wordCount / minWords) * criterion.maxPoints * 0.5));
  }

  /**
   * Manual grade creation
   */
  static async createManualGrade(gradingData) {
    const grade = new Grade({
      ...gradingData,
      isAutoGraded: false,
      gradingMethod: 'manual'
    });

    grade.calculateLetterGrade();
    return grade;
  }

  /**
   * Update existing grade
   */
  static async updateGrade(gradeId, updateData) {
    const grade = await Grade.findByIdAndUpdate(
      gradeId,
      { ...updateData, gradeChangedDate: new Date() },
      { new: true }
    );

    if (grade && updateData.percentage) {
      grade.calculateLetterGrade();
      await grade.save();
    }

    return grade;
  }

  /**
   * Get grade statistics for an assignment
   */
  static async getGradeStatistics(assignmentId) {
    const grades = await Grade.find({ assignment: assignmentId });

    if (grades.length === 0) {
      return {
        count: 0,
        average: 0,
        median: 0,
        min: 0,
        max: 0,
        standardDeviation: 0
      };
    }

    const scores = grades.map(g => g.percentage).sort((a, b) => a - b);
    const count = scores.length;
    const sum = scores.reduce((a, b) => a + b, 0);
    const average = sum / count;
    const median = count % 2 === 0
      ? (scores[count / 2 - 1] + scores[count / 2]) / 2
      : scores[Math.floor(count / 2)];

    // Calculate standard deviation
    const squareDiffs = scores.map(score => Math.pow(score - average, 2));
    const variance = squareDiffs.reduce((a, b) => a + b, 0) / count;
    const standardDeviation = Math.sqrt(variance);

    return {
      count,
      average: Math.round(average * 100) / 100,
      median,
      min: Math.min(...scores),
      max: Math.max(...scores),
      standardDeviation: Math.round(standardDeviation * 100) / 100
    };
  }
}

module.exports = GradingService;
