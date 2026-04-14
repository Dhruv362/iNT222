const Analytics = require('../models/Analytics');
const Grade = require('../models/Grade');
const Submission = require('../models/Submission');
const Assignment = require('../models/Assignment');
const User = require('../models/User');

class AnalyticsService {
  /**
   * Calculate analytics for an assignment
   */
  static async calculateAssignmentAnalytics(assignmentId) {
    try {
      const assignment = await Assignment.findById(assignmentId);
      const submissions = await Submission.find({ assignment: assignmentId });
      const grades = await Grade.find({ assignment: assignmentId }).populate('student');

      if (grades.length === 0) {
        return null;
      }

      const scores = grades.map(g => g.percentage).sort((a, b) => a - b);
      
      // Calculate statistics
      const totalSubmissions = submissions.length;
      const submissionRate = (totalSubmissions / assignment._doc?.enrollmentCount || totalSubmissions) * 100;
      const lateSubmissions = submissions.filter(s => s.isLate).length;
      
      const averageScore = scores.reduce((a, b) => a + b, 0) / scores.length;
      const medianScore = scores.length % 2 === 0
        ? (scores[scores.length / 2 - 1] + scores[scores.length / 2]) / 2
        : scores[Math.floor(scores.length / 2)];
      
      // Standard deviation
      const variance = scores.reduce((sum, score) => sum + Math.pow(score - averageScore, 2), 0) / scores.length;
      const standardDeviation = Math.sqrt(variance);

      // Grade distribution
      const scoreDistribution = {
        A: grades.filter(g => g.percentage >= 90).length,
        B: grades.filter(g => g.percentage >= 80 && g.percentage < 90).length,
        C: grades.filter(g => g.percentage >= 70 && g.percentage < 80).length,
        D: grades.filter(g => g.percentage >= 60 && g.percentage < 70).length,
        F: grades.filter(g => g.percentage < 60).length
      };

      // Class average
      let classAverageGrade = 'C';
      if (averageScore >= 90) classAverageGrade = 'A';
      else if (averageScore >= 80) classAverageGrade = 'B';
      else if (averageScore >= 70) classAverageGrade = 'C';
      else if (averageScore >= 60) classAverageGrade = 'D';
      else classAverageGrade = 'F';

      // Struggling students and top performers
      const sortedByScore = grades.sort((a, b) => a.percentage - b.percentage);
      const strugglingStudents = sortedByScore.slice(0, 3).map(g => ({
        studentId: g.student._id,
        name: `${g.student.firstName} ${g.student.lastName}`,
        scorePercentage: g.percentage
      }));

      const topPerformers = sortedByScore.slice(-3).reverse().map(g => ({
        studentId: g.student._id,
        name: `${g.student.firstName} ${g.student.lastName}`,
        scorePercentage: g.percentage
      }));

      // Plagiarism statistics
      const submissionsWithPlagiarism = submissions.filter(s => s.plagiariusScore > 30).length;
      const avgPlagiarismScore = submissions.reduce((sum, s) => sum + (s.plagiariusScore || 0), 0) / totalSubmissions;

      // Calculate timing
      const submissionTimes = submissions
        .filter(s => s.submittedDate)
        .map(s => s.submittedDate.getTime() - assignment.dueDate.getTime());
      
      const avgSubmissionTime = submissionTimes.length > 0
        ? submissionTimes.reduce((a, b) => a + b, 0) / submissionTimes.length
        : 0;

      // Create analytics document
      const analytics = new Analytics({
        assignment: assignmentId,
        course: assignment.courseCode,
        teacher: assignment.teacher,
        totalSubmissions,
        submissionRate,
        lateSubmissions,
        averageScore: Math.round(averageScore * 100) / 100,
        medianScore: Math.round(medianScore * 100) / 100,
        standardDeviation: Math.round(standardDeviation * 100) / 100,
        highestScore: Math.max(...scores),
        lowestScore: Math.min(...scores),
        scoreDistribution,
        classAverageGrade,
        strugglingStudents,
        topPerformers,
        plagiariusStatistics: {
          averagePlagiarismScore: Math.round(avgPlagiarismScore * 100) / 100,
          submissionsWithHighPlagiarism: submissionsWithPlagiarism
        },
        averageSubmissionTime: Math.round(avgSubmissionTime / 1000 / 60) // Convert to minutes
      });

      return analytics;
    } catch (error) {
      console.error('Analytics calculation error:', error);
      return null;
    }
  }

  /**
   * Get course-level analytics
   */
  static async getCourseLevelAnalytics(courseCode, teacherId) {
    try {
      const assignments = await Assignment.find({
        courseCode: courseCode,
        teacher: teacherId
      });

      const results = [];
      for (const assignment of assignments) {
        const analytics = await this.calculateAssignmentAnalytics(assignment._id);
        if (analytics) results.push(analytics);
      }

      // Aggregate course statistics
      if (results.length === 0) return null;

      const courseAnalytics = {
        courseCode,
        totalAssignments: assignments.length,
        totalSubmissions: results.reduce((sum, a) => sum + a.totalSubmissions, 0),
        overallAverageScore: Math.round(
          results.reduce((sum, a) => sum + a.averageScore, 0) / results.length * 100
        ) / 100,
        assignmentBreakdown: results
      };

      return courseAnalytics;
    } catch (error) {
      console.error('Course analytics error:', error);
      return null;
    }
  }

  /**
   * Get student progress analytics
   */
  static async getStudentProgressAnalytics(studentId, assignmentIds = null) {
    try {
      const query = { student: studentId };
      if (assignmentIds) query.assignment = { $in: assignmentIds };

      const grades = await Grade.find(query)
        .populate('assignment')
        .sort({ createdAt: 1 });

      if (grades.length === 0) return null;

      const progressData = {
        studentId,
        totalAssignments: grades.length,
        averageScore: Math.round(
          grades.reduce((sum, g) => sum + g.percentage, 0) / grades.length * 100
        ) / 100,
        trendline: grades.map(g => ({
          assignmentId: g.assignment._id,
          assignmentName: g.assignment.title,
          score: g.percentage,
          date: g.gradedDate
        })),
        improvementRate: grades.length > 1
          ? Math.round(((grades[grades.length - 1].percentage - grades[0].percentage) / grades[0].percentage) * 100)
          : 0
      };

      return progressData;
    } catch (error) {
      console.error('Student analytics error:', error);
      return null;
    }
  }

  /**
   * Store analytics in database
   */
  static async saveAnalytics(analyticsData) {
    try {
      const existing = await Analytics.findOne({
        assignment: analyticsData.assignment
      });

      if (existing) {
        return await Analytics.findByIdAndUpdate(
          existing._id,
          analyticsData,
          { new: true }
        );
      }

      return await analyticsData.save();
    } catch (error) {
      console.error('Analytics save error:', error);
      return null;
    }
  }
}

module.exports = AnalyticsService;
